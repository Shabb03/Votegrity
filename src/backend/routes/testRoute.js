const express = require('express');
const router = express.Router();
//const authenticateToken = require('../middleware/authenticate');

const testController = require('../controllers/testController');

router.get('/g', testController.gettest)
router.post('/p', testController.posttest)

module.exports = router;