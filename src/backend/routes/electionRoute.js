const express = require('express');
const router = express.Router();

const voteController = require('../controllers/voteController');
const winnerController = require('../controllers/winnerController');

router.get('/candidates', voteController.getAllCandidates)
router.post('/vote', voteController.submitVote);

router.get('/results', winnerController.getResults);

module.exports = router;