const db = require('../models/index.js');

//Get the resulting winner of current election
exports.getResults = async (req, res) => {
    try {
        const activeElections = await db.Election.findAll({
            attributes: ['id', 'title', 'resultDate'],
            where: {
                isActive: false,
            },
            order: [['resultDate', 'DESC']],
        });

        const result = await Promise.all(activeElections.map(async (election) => {
            const electionId = election.id;
            const results = await db.Result.findAll({ where: { electionId: electionId } });
            const candidates = await Promise.all(results.map(async (result) => {
                const candidate = await db.Candidate.findByPk(result.winner);
                return {
                    id: candidate.id,
                    name: candidate.name,
                    voice: candidate.voice,
                    party: candidate.party,
                    image: candidate.image,
                    biography: candidate.biography,
                    voteCount: result.voteCount
                };
            }));
            return {
                id: electionId,
                title: election.title,
                candidates: candidates
            };
        }));
        return res.json({ electionResults: result });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};