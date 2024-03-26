const express = require('express');
const router = express.Router();
const loginLimiter = require('../middleware/rateLimiter');
const authenticateToken = require('../middleware/authenticate');

const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const profileController = require('../controllers/profileController');
const passwordController = require('../controllers/passwordController');
const deleteController = require('../controllers/deleteController');

router.get('/securityquestions', registerController.securityQuestions)
router.post('/register', registerController.signup);  //update with public/private keys and wallet 

router.post('/publickey', loginController.getKey);
router.post('/login', loginLimiter, loginController.login);

router.get('/userinfo', authenticateToken, profileController.userInfo);
router.post('/userdetails', authenticateToken, profileController.changeUserDetails);
router.get('/registertoken', authenticateToken, profileController.getAuthToken);
router.post('/authenticateaccount', authenticateToken, profileController.authAccount);

router.post('/authenticationcode', passwordController.authCode);
router.post('/changepassword', passwordController.changePassword);

router.get('/deletecode', authenticateToken, deleteController.deleteCode);
router.post('/deleteaccount', authenticateToken, deleteController.deleteAccount);

module.exports = router;