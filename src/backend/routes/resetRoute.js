const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

//subject to change
router.post('/api/admin/reset/:string', {{FILENAME}}.resetElection);

module.exports = router;