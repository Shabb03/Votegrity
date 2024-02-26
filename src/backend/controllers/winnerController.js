const { Result, Election, Candidate } = require('../sequelize');

//Get the resulting winner of current election
exports.getResults = async (req, res) => {
    try {
        const activeElections = await Election.findAll({
            attributes: ['id', 'title', 'results'],
            where: {
                isActive: false,
            },
        });

        const result = await Promise.all(activeElections.map(async (election) => {
            const results = await Result.findByPk(election.results);
            const candidate = await Candidate.findByPk(results.winner);
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
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};