const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.post('/api/login', {{FILENAME}}.login);

module.exports = router;