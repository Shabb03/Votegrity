const db = require('../models/index.js');

//Get the resulting winner of current election
exports.getResults = async (req, res) => {
    try {
        const activeElection = await db.Election.findOne({where: { isActive: true }});
        if (!activeElection) {
            return res.status(404).json({ message: 'Active election not found' });
        }
        const resultsId = activeElection.results;
        if (!resultsId) {
            return res.status(404).json({ message: 'Results not found' });
        }
        const results = await db.Result.findByPk(resultsId);
        if (!results) {
            return res.status(404).json({ message: 'Results not found' });
        }
        const candidate = await db.Candidate.findByPk(results.winner);
        res.json({
            id: candidate.id,
            name: candidate.name,
            voice: candidate.voice,
            party: candidate.party,
            image: candidate.image,
            biography: candidate.biography,
            voteCount: results.voteCount 
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};