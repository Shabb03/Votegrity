const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

const voteController = require('../controllers/voteController');
const winnerController = require('../controllers/winnerController');

router.get('/candidates', authenticateToken, voteController.getAllCandidates)
router.post('/vote', authenticateToken, voteController.submitVote);

router.get('/results', authenticateToken, winnerController.getResults);

module.exports = router;