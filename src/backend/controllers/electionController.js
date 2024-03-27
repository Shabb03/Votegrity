const sendEmail = require('./thirdParty/email');
const { generateKeys } = require('./functions/generateKeys');
const { generatePublishKey } = require('./functions/generateCode');
const { decryptPassword } = require('./functions/password');
const { Admin, Candidate, Election } = require('../sequelize');
const countryData = require('../assets/citizenship.json');
const votingProcess = require('../assets/process.json');

//Create a new election
exports.addElection = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Admin.findByPk(userId);

        const { title, description, startDate, endDate, resultDate, candidateNumber, ageRestriction, authEmail, authCitizenship, type } = req.body;
        if(!title || !description || !startDate || !endDate || !resultDate || !candidateNumber || !ageRestriction || !authEmail || !authCitizenship || !type) {
            return res.json({ error: 'All required inputs not provided' });
        }        
        if (countryData !== null && !countryData.includes(citizenship)) {
            return res.json({error: 'Incorrect citizenship provided'});
        }
        if (type !== null && !votingProcess.includes(type)) {
            return res.json({error: 'Incorrect election voting process provided'});
        }
        const { privateKey, publicKey } = await generateKeys();
        const publishKey = await generatePublishKey();
        sendEmail("Election Publish Key", user.email, "Here is your code to publish your new election " + title + ": " + publishKey);
        const newElection = await Election.create({
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            resultDate: resultDate,
            candidateNumber: candidateNumber,
            ageRestriction: ageRestriction,
            privateKey: privateKey,
            publicKey: publicKey,
            results: null,
            authEmail: authEmail,
            authCitizenship: authCitizenship,
            type: type,
            publishKey: publishKey,
        });
        res.json({election: newElection.title, message: 'Election created successfully'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//get a list of all new elections where the number of added candidates is less than the required number of candidates
exports.getNewElections = async (req, res) => {
    try {
        const activeElections = await Election.findAll({
            attributes: ['id', 'title', 'candidateNumber'],
            where: {
                isActive: true,
            },
            order: [['resultDate', 'DESC']],
        });
        const result = await Promise.all(activeElections.map(async (election) => {
            const addedCandidates = await Candidate.count({
                where: {
                    electionId: election.id,
                },
            });
            if (election.candidateNumber > addedCandidates) {
                return {
                    id: election.id,
                    title: election.title,
                    candidateNumber: election.candidateNumber,
                    addedCandidates: addedCandidates,
                };
            } 
            else {return null;}
        }));
        const filteredResult = result.filter(election => election !== null);
        res.json({ activeElections: filteredResult });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Add a new candidate to the newly created election
exports.addCandidate = async (req, res) => {
    try {
        const { name, voice, party, dateOfBirth, biography, electionId } = req.body;
        if (!name || !voice || !party || !dateOfBirth || !biography || !electionId) {
            return res.json({ error: 'All required inputs not provided' });
        }
        const activeElection = await Election.findByPk(electionId);
        const candidateCount = activeElection.candidateCount;
        const totalCandidates = await Candidate.count({where: {electionId: electionId}});
        if (totalCandidates >= candidateCount) {
            return res.json({error: "Total number of candidates exceeded"});
        }
        const image = req.file;
        const imagePath = image.filename;
        const newCandidate = await Candidate.create({
            name: name,
            voice: voice,
            party: party,
            image: imagePath,
            dateOfBirth: dateOfBirth,
            biography: biography,
            electionId: electionId,
        });
        res.json({candidate: newCandidate, message: 'Candidate created successfully'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
