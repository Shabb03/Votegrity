const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.get('/api/admin/candidateCount', {{FILENAME}}.getCandidateCount);
router.post('/api/admin/addCandidate', {{FILENAME}}.addCandidate);

module.exports = router;