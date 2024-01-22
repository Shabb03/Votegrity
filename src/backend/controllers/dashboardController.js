const { Vote, Election } = require('../sequelize');

exports.electionDetails = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: {isActive: true}});
        if (activeElection) {
            res.json({
                title: activeElection.title, 
                description: activeElection.description, 
                startDate: activeElection.startDate, 
                endDate: activeElection.endDate, 
                resultDate: activeElection.resultDate, 
                candidateNumber: activeElection.candidateNumber, 
                ageRestriction: activeElection.ageRestriction, 
                authenticationMethod: activeElection.authenticationMethod
            });
        } else {
            res.status(404).json({ message: 'No active election found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getTotalVotes = async (req, res) => {
    try {
        const totalVoteCount = await Vote.count();
        res.json({voteCount: totalVoteCount});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};