const db = require('../models/index.js');

//Get the resulting winner of current election
exports.getResults = async (req, res) => {
    try {
        const activeElections = await db.Election.findAll({
            attributes: ['id', 'title', 'results'],
            where: {
                isActive: false,
            },
            order: [['resultDate', 'DESC']],
        });

        const result = await Promise.all(activeElections.map(async (election) => {
            const results = await db.Result.findByPk(election.results);
            const candidate = await db.Candidate.findByPk(results.winner);
            return {
                title: election.title,
                id: candidate.id,
                name: candidate.name,
                voice: candidate.voice,
                party: candidate.party,
                image: candidate.image,
                biography: candidate.biography,
                voteCount: results.voteCount
            };
        }));
        res.json({ electionResults: result });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};