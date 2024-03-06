const db = require('../models/index.js');

//Get the details of the current election
exports.electionDetails = async (req, res) => {
    try {
        const activeElections = await db.Election.findAll({
            attributes: ['id', 'title', 'description', 'startDate', 'endDate', 'resultDate', 'candidateNumber', 'ageRestriction', 'authEmail', 'authCitizenship'],
            where: {
                isActive: true,
            },
            order: [['resultDate', 'DESC']],
        });
        if (activeElections) {
            const result = await Promise.all(activeElections.map(async (election) => {
                const totalVoteCount = await db.Vote.count({
                    where: {
                        electionId: election.id,
                    },
                });
    
                return {
                    id: election.id,
                    title: election.title,
                    description: election.description,
                    startDate: election.startDate,
                    endDate: election.endDate,
                    resultDate: election.resultDate,
                    candidateNumber: election.candidateNumber,
                    addedCandidates: election.addedCandidates,
                    ageRestriction: election.ageRestriction,
                    authEmail: election.authEmail,
                    authCitizenship: election.authCitizenship,
                    voteCount: totalVoteCount,
                };
            }));
            res.json({ activeElections: result });
        } 
        else {
            res.json({ error: 'No active election found', election: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};