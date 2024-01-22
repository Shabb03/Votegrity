const { Candidate, Election } = require('../sequelize');

//Create a new election
exports.addElection = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: {isActive: true}});
        if (activeElection) {
            return res.json({error: "An election is currently active, you must reset the election"});
        }

        const { title, description, startDate, endDate, resultDate, candidateNumber, ageRestriction, authenticationMethod } = req.body;
        const newElection = await Election.create({
            title,
            description,
            startDate,
            endDate,
            resultDate,
            candidateNumber,
            ageRestriction,
            authenticationMethod
        });
        res.status(201).json({election: newElection, message: 'Election created successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Get the total number of candidates the newly created election must have
exports.getCandidateCount = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: {isActive: true}});
        const candidateCount = activeElection.candidateCount;
        res.json({
            candidateCount: candidateCount 
        });
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

        const { name, voice, party, image, dateOfBirth, biography } = req.body;
        const newCandidate = await Candidate.create({
            name,
            voice,
            party,
            image,
            dateOfBirth,
            biography
        });
        res.status(201).json({candidate: newCandidate, message: 'Candidate created successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};