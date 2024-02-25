const { Vote, Election } = require('../sequelize');

//Get the details of the current election
exports.electionDetails = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: {isActive: true}});
        if (activeElection) {
            const totalVoteCount = await Vote.count();
            res.json({
                id: activeElection.id,
                title: activeElection.title, 
                description: activeElection.description, 
                startDate: activeElection.startDate, 
                endDate: activeElection.endDate, 
                resultDate: activeElection.resultDate, 
                candidateNumber: activeElection.candidateNumber,
                ageRestriction: activeElection.ageRestriction, 
                email: activeElection.authEmail,
                citizenship: activeElection.authCitizenship,
                voteCount: totalVoteCount,
            });
        } 
        else {
            res.json({ error: 'No active election found', election: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};