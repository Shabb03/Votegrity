const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authenticate');

const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
//const profileController = require('../controllers/profileController');
//const passwordController = require('../controllers/passwordController');

router.post('/register', registerController.signup);

router.post('/login', loginController.login);

router.post('/logout', authenticateToken, loginController.logout);

/*
router.get('/user', profileController.userInfo);
router.post('/useremail/:id/:string', profileController.changeUserEmail)
router.post('/usernumber/:id/:string', profileController.changeUserNumber)

router.get('/authenticateaccount', passwordController.authAccount);
router.get('/authenticationcode', passwordController.authCode);
router.post('/resetpassword', passwordController.resetPassword);
router.post('/changepassword', passwordController.changePassword);
*/

module.exports = router;