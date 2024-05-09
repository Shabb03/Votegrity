const db = require('../models/index.js');

//Get the details of the current election
exports.electionDetails = async (req, res) => {
    try {
        const activeElections = await db.Election.findAll({
            attributes: ['id', 'title', 'description', 'startDate', 'endDate', 'resultDate', 'candidateNumber', 'ageRestriction', 'authEmail', 'authCitizenship', 'type'],
            where: {
                isActive: true,
            },
            order: [['resultDate', 'DESC']],
        });
        if (activeElections) {
            const result = await Promise.all(activeElections.map(async (election) => {
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
                    type: election.type,
                };
            }));
            res.json({ activeElections: result });
        }
        else {
            res.json({ error: 'No active election found', election: false });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};