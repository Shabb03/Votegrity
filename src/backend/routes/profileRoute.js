const express = require('express');
const router = express.Router();
const voterController = require('../controllers/{{FILENAME}}');

router.get('/api/user', {{FILENAME}}.userInfo);
router.post('/api/useremail/:id/:string', {{FILENAME}}.changeUserEmail)
router.post('/api/usernumber/:id/:string', {{FILENAME}}.changeUserNumber)

module.exports = router;