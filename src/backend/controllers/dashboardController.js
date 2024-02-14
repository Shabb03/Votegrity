const db = require('../models/index.js');

//Get the details of the current election
exports.electionDetails = async (req, res) => {
    try {
        const activeElection = await db.Election.findOne({where: {isActive: true}});
        if (activeElection) {
            const totalVoteCount = await db.Vote.count();
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
            res.status(404).json({ message: 'No active election found', election: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};