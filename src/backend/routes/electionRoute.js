const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

const voteController = require('../controllers/voteController');
const winnerController = require('../controllers/winnerController');

//add a new route to display images
router.get('/candidates', authenticateToken, voteController.getAllCandidates);
router.get('/image/:id', voteController.getImage);

router.post('/vote', authenticateToken, voteController.submitVote);  //yet to test

router.get('/results', authenticateToken, winnerController.getResults);

module.exports = router;