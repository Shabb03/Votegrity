const db = require('../models/index.js');

//get all active elections
exports.getActiveElections = async (req, res) => {
    try {
        const activeElections = await db.Election.findAll({
            attributes: ['id', 'title', 'resultDate'],
            where: {
                isActive: true,
            },
            order: [['resultDate', 'DESC']],
        });
        res.json({ activeElections: activeElections });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Publish the results of the election and make it inactive
exports.publishResults = async (req, res) => {
    try {
        const { electionId, privateKey } = req.body; 
        const election = await db.Election.findByPk(electionId);
        if (!election || !election.isActive) {
            res.json({error: 'Active Election not found'});
        }

        //do something to publish results using privateKey and get total voteCount

        //do something to get all the votes for that specific candidate
        
        /*
        const newResult = await Result.create({
            winner: 2,
            voteCount: 300,
        });
        election.isActive = false;
        election.results = newResult.id;
        await election.save();
        */
     
        res.json({message: 'Election results successfully published'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}