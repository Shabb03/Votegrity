const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate');

const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const profileController = require('../controllers/profileController');
const passwordController = require('../controllers/passwordController');

router.post('/register', registerController.signup);

router.post('/login', loginController.login);

router.get('/userinfo', authenticateToken, profileController.userInfo);
router.post('/useremail', authenticateToken, profileController.changeUserEmail)
router.post('/usernumber/', authenticateToken, profileController.changeUserNumber)
router.get('/registertoken', authenticateToken, profileController.getAuthToken);
router.post('/authenticateaccount', authenticateToken, profileController.authAccount);

router.get('/authenticationcode', authenticateToken, passwordController.authCode);
router.post('/resetpassword', authenticateToken, passwordController.resetPassword);
router.post('/changepassword', authenticateToken, passwordController.changePassword);

module.exports = router;