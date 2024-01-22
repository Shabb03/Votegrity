const { Candidate, Vote } = require('../sequelize');

exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({where: { isWinner: false }});
        res.json({ candidates });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.submitVote = async (req, res) => {
    try {
        const { voterId, candidateId } = req.body;
        const vote = await Vote.create({
            voterId: voterId,
            candidateId: candidateId,
        });
        res.json({ message: 'Vote submitted successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};