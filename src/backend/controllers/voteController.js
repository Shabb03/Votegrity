const { Candidate, Vote } = require('../sequelize');

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

//Get the details of all candidates in the current election
exports.getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({where: { isWinner: false }, attributes: ['id', 'name', 'voice', 'party', 'dateOfBirth', 'biography']});
        res.json({ candidates });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getImage = async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        const imagePath = path.join(__dirname, "../images/", candidate.image);
        const imageData = await readFileAsync(imagePath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Submit a vote cast by the user
exports.submitVote = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        const authenticatedUser = user.authenticated;
        if (!authenticatedUser) {
            return res.json({error: 'User is not authenticated', authenticated: false});
        }
        const candidateId = req.body.candidateId;
        if (!candidateId) {
            return res.json({error: 'No candidate selected'})
        }
        const vote = await Vote.create({
            voterId: userId,
            candidateId: candidateId,
        });
        res.json({ message: 'Vote submitted successfully'});
        //Work on this later to synchronize with the blockchain network
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};