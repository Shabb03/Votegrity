const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.post('/api/register', registerController.signup);

module.exports = router;