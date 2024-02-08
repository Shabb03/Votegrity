const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const profileController = require('../controllers/profileController');
const passwordController = require('../controllers/passwordController');

router.get('/securityquestions', registerController.securityQuestions)
router.post('/register', registerController.signup);

router.post('/login', loginController.login);

router.get('/userinfo', authenticateToken, profileController.userInfo);
router.post('/userdetails', authenticateToken, profileController.changeUserDetails);
router.get('/registertoken', authenticateToken, profileController.getAuthToken);
router.post('/authenticateaccount', authenticateToken, profileController.authAccount);

router.get('/authenticationcode', passwordController.authCode);
router.post('/changepassword', passwordController.changePassword);

module.exports = router;