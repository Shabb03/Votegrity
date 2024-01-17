const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.get('/api/candidates', {{FILENAME}}.getAllCandidates)
router.post('/api/vote/:voterId/:candidateId', {{FILENAME}}.submitVote);

module.exports = router;