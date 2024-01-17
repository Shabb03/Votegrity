const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.post('/api/admin/addElection', {{FILENAME}}.addElection);

module.exports = router;