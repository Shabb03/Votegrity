//const sendEmail = require('./thirdParty/email');
//const generateSixDigitCode = require('./functions/generateCode');
const { Candidate, Election } = require('../sequelize');
const countryData = require('../assets/citizenship.json');


//Create a new election
exports.addElection = async (req, res) => {
    try {
        const { title, description, startDate, endDate, resultDate, candidateNumber, ageRestriction, authEmail, authCitizenship } = req.body;
        if(!title || !description || !startDate || !endDate || !resultDate || !candidateNumber || !ageRestriction) {
            return res.json({ error: 'All required inputs not provided' });
        }        
        if (countryData !== null && !countryData.includes(citizenship)) {
            return res.json({error: 'Incorrect citizenship provided'});
        }
        const newElection = await Election.create({
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            resultDate: resultDate,
            candidateNumber: candidateNumber,
            ageRestriction: ageRestriction,
            privateKey: null,
            publicKey: null,
            results: null,
            authEmail: authEmail,
            authCitizenship: authCitizenship,
        });

        const electionResponse = {
            title: newElection.title,
            description: newElection.description,
            startDate: newElection.startDate,
            endDate: newElection.endDate,
            resultDate: newElection.resultDate,
            candidateNumber: newElection.candidateNumber,
            ageRestriction: newElection.ageRestriction,
            authEmail: authEmail,
            authCitizenship: authCitizenship,
        }
        res.json({election: electionResponse, message: 'Election created successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getNewElections = async (req, res) => {
    try {
        const activeElections = await Election.findAll({
            attributes: ['id', 'title', 'candidateNumber'],
            where: {
                isActive: true,
            },
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
        //res.json({ activeElections: result });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Add a new candidate to the newly created election
exports.addCandidate = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: {isActive: true}});
        const candidateCount = activeElection.candidateCount;
        const totalCandidates = await Candidate.count({where: {isWinner: false}});

        if (totalCandidates >= candidateCount) {
            return res.json({error: "Total number of candidates exceeded"});
        }

        const { name, voice, party, dateOfBirth, biography, electionId } = req.body;
        if (!name || !voice || !party || !dateOfBirth || !biography || !electionId) {
            return res.json({ error: 'All required inputs not provided' });
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
        //res.json({imagePath: image.filename});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/*exports.resetToken = async (req, res) => {
    try {
        const adminId = req.user.id;
        const user = await Admin.findByPk(userId);

        const sixDigitCode = generateSixDigitCode();
        const activeElection = await Election.findOne({where: {isActive: true}});

        activeElection. = sixDigitCode;
        await activeElection.save();

        sendEmail("Authentication Code", user.email, "Here is the election reset code: " + sixDigitCode);
        res.json({message: "Email sent"});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};*/

/*exports.resetElection = async (req, res) => {
    try {
        const { token } = req.body;
        const election = await Election.findOne({where: {isActive: true}});
        if (!election) {
            return res.json({ error: 'No active election found.' });
        }
        if (token !== election.) {
            return res.json({ error: 'Invalid reset code.' });
        }
        election.isActive = false;
        await election.save();
        await Candidate.destroy({ where: { isWinner: false } });
        return res.json({ message: 'Election reset successfully.', reset: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};*/
