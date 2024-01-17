const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.get('/api/results', {{FILENAME}}.getResults);

module.exports = router;