const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.post('/api/register', {{FILENAME}}.signup);

module.exports = router;