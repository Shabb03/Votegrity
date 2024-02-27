const { Election } = require('../sequelize');

exports.getActiveElections = async (req, res) => {
    try {
        const activeElections = await Election.findAll({
            attributes: ['id', 'title', 'resultDate'],
            where: {
                isActive: true,
            },
        });
        res.json({ activeElections: activeElections });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.publishResults = async (req, res) => {
    try {
        const { electionId, privateKey } = req.body; 
        const election = await Election.findByPk(electionId);
        if (!election) {
            res.json({error: 'Active Election not found'});
        }
        //do something to publish results using privateKey
        res.json({message: 'Election results successfully published'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}