const { Candidate, Vote } = require('../sequelize');

//Get the details of all candidates in the current election
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({where: { isWinner: false }});
        res.json({ candidates });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Submit a vote cast by the user
exports.submitVote = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        const authenticatedUser = user.authenticated;
        if (!authenticatedUser) {
            return res.json({error: 'User is not authenticated'});
        }
        const { voterId, candidateId } = req.body;
        const vote = await Vote.create({
            voterId: voterId,
            candidateId: candidateId,
        });
        res.json({ message: 'Vote submitted successfully'});
        //Work on this later to synchronize with the blockchain network
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};