const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.get('/api/admin/election', {{FILENAME}}.electionDetails);
router.get('/api/admin/votes', {{FILENAME}}.getTotalVotes);

module.exports = router;