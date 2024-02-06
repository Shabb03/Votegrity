const { Candidate, Vote } = require('../sequelize');

//Get the details of all candidates in the current election
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({where: { isWinner: false }});
        const testCan = await Candidate.findByPk(2);
        res.json({image: testCan.image, image2: '../images/1707171968878-trump.jpg'});
        //res.json({ candidates });
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
            return res.json({error: 'User is not authenticated', authenticated: false});
        }
        const candidateId = req.body.candidateId;
        const vote = await Vote.create({
            voterId: userId,
            candidateId: candidateId,
        });
        res.json({ message: 'Vote submitted successfully'});
        //Work on this later to synchronize with the blockchain network
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};