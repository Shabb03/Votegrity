const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.get('/api/authenticateaccount', {{FILENAME}}.login);
router.get('/api/authenticationcode', {{FILENAME}}.login);
router.post('/api/resetpassword', {{FILENAME}}.login);
router.post('/api/changepassword', {{FILENAME}}.login);

module.exports = router;