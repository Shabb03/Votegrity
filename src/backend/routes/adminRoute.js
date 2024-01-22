const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isadmin');

const loginController = require('../controllers/loginController');
const electionController = require('../controllers/electionController');
//const dashboardController = require('../controllers/dashboardController');
//const resetController = require('../controllers/resetController');

router.post('/login', loginController.adminLogin);

router.post('/admin/addElection', isAdmin, electionController.addElection);
router.get('/admin/candidateCount', isAdmin, electionController.getCandidateCount);
router.post('/admin/addCandidate', isAdmin, electionController.addCandidate);

/*
router.get('/admin/election', isAdmin, dashboardController.electionDetails);
router.get('/admin/votes', isAdmin, dashboardController.getTotalVotes);

//subject to change
router.post('/admin/reset/', isAdmin, resetController.resetElection);
*/

module.exports = router;