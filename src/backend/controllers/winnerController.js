const { Result, Election, Candidate } = require('../sequelize');

//Get the resulting winner of current election
exports.getResults = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: { isActive: true }});
        if (!activeElection) {
            return res.status(404).json({ message: 'Active election not found' });
        }
        const resultsId = activeElection.result;
        const results = await Result.findByPk(resultsId);
        const candidate = await Candidate.findByPk(results.winner);
        res.json({ 
            name: canidate.name,
            voice: candidate.voice,
            party: candidate.party,
            image: candidate.image,
            biography: candidate.biography,
            voteCount: results.voteCount 
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};