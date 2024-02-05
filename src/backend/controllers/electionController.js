//const sendEmail = require('./thirdParty/email');
//const generateSixDigitCode = require('./functions/generateCode');
const { Candidate, Election, Admin } = require('../sequelize');

//Create a new election
exports.addElection = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: {isActive: true}});
        if (activeElection) {
            return res.json({error: "An election is currently active, you must reset the election"});
        }

        const { title, description, startDate, endDate, resultDate, candidateNumber, ageRestriction, authenticationMethod } = req.body;
        const newElection = await Election.create({
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            resultDate: resultDate,
            candidateNumber: candidateNumber,
            ageRestriction: ageRestriction,
            authenticationMethod: authenticationMethod,
            privateKey: null,
            publicKey: null,
            results: null
        });
        const electionResponse = {
            title: newElection.title,
            description: newElection.description,
            startDate: newElection.startDate,
            endDate: newElection.endDate,
            resultDate: newElection.resultDate,
            candidateNumber: newElection.candidateNumber,
            ageRestriction: newElection.ageRestriction
        }
        res.status(201).json({election: electionResponse, message: 'Election created successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Get the total number of candidates the newly created election must have
exports.getCandidateCount = async (req, res) => {
    try {
        const addedCandidates = await Candidate.count({where: {isWinner: false}});
        const activeElection = await Election.findOne({where: {isActive: true}});
        const candidateCount = activeElection.candidateCount;
        res.json({
            addedCandidates: addedCandidates,
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
        const resetCode = req.body.resetCode;
        const election = await Election.findOne({where: {isActive: true}});
        if (!election) {
            return res.status(404).json({ error: 'No active election found.' });
        }
        if (resetCode !== election.) {
            return res.status(401).json({ error: 'Invalid reset code.' });
        }
        election.isActive = false;
        await election.save();
        await Candidate.destroy({ where: { isWinner: false } });
        return res.status(200).json({ message: 'Election reset successfully.', reset: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};*/