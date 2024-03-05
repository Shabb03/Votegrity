const { Candidate, Election } = require('../sequelize');
const countryData = require('../assets/citizenship.json');

//Create a new election
exports.addElection = async (req, res) => {
    try {
        const { title, description, startDate, endDate, resultDate, candidateNumber, ageRestriction, authEmail, authCitizenship } = req.body;
        if(!title || !description || !startDate || !endDate || !resultDate || !candidateNumber || !ageRestriction || !authEmail || !authCitizenship) {
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
        res.json({election: newElection.title, message: 'Election created successfully'});
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
        const newCandidate = await db.Candidate.create({
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
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
