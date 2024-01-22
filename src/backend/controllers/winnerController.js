const { Result, Election } = require('../sequelize');

exports.getResults = async (req, res) => {
    try {
        const activeElection = await Election.findOne({where: { isActive: true }});
        if (!activeElection) {
            return res.status(404).json({ message: 'Active election not found' });
        }
        const resultsId = activeElection.result;
        const results = await Result.findByPk(resultsId);
        res.json({ results});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};