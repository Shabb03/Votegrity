const express = require('express');
const router = express.Router();

const candidateController = require('../controllers/candidateController');
const electionController = require('../controllers/electionController');
const dashboardController = require('../controllers/dashboardController');
const resetController = require('../controllers/resetController');

router.get('/admin/candidateCount', candidateController.getCandidateCount);
router.post('/admin/addCandidate', candidateController.addCandidate);

router.post('/admin/addElection', electionController.addElection);

router.get('/admin/election', dashboardController.electionDetails);
router.get('/admin/votes', dashboardController.getTotalVotes);

//subject to change
router.post('/admin/reset/', resetController.resetElection);

module.exports = router;