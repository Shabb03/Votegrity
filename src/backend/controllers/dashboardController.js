const { Vote, Election } = require('../sequelize');

//Get the details of the current election
exports.electionDetails = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: {isActive: true}});
        if (activeElection) {
            const totalVoteCount = await Vote.count();
            res.json({
                title: activeElection.title, 
                description: activeElection.description, 
                startDate: activeElection.startDate, 
                endDate: activeElection.endDate, 
                resultDate: activeElection.resultDate, 
                candidateNumber: activeElection.candidateNumber,
                ageRestriction: activeElection.ageRestriction, 
                authenticationMethod: activeElection.authenticationMethod,
                voteCount: totalVoteCount
            });
        } else {
            res.json({ error: 'No active election found', election: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};