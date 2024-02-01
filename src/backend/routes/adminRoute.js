const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isadmin');

const loginController = require('../controllers/loginController');
const electionController = require('../controllers/electionController');
const dashboardController = require('../controllers/dashboardController');

router.post('/login', loginController.adminLogin);

router.post('/addelection', isAdmin, electionController.addElection);
router.get('/candidatecount', isAdmin, electionController.getCandidateCount);
router.post('/addcandidate', isAdmin, electionController.addCandidate);

//subject to change
//router.get('/resettoken', isAdmin, electionController.resetToken);
//router.post('/reset', isAdmin, electionController.resetElection);

router.get('/election', isAdmin, dashboardController.electionDetails);
//router.get('/votes', isAdmin, dashboardController.getTotalVotes);

module.exports = router;