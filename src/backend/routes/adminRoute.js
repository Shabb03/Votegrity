const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isadmin');

const multer = require('multer');
const path = require('path');

const destinationFolder = path.join(__dirname, '../images');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });


const loginController = require('../controllers/loginController');
const electionController = require('../controllers/electionController');
const dashboardController = require('../controllers/dashboardController');

router.post('/login', loginController.adminLogin);

router.post('/addelection', isAdmin, electionController.addElection);
router.get('/candidatecount', isAdmin, electionController.getCandidateCount);
router.post('/addcandidate', isAdmin, upload.single('image'), electionController.addCandidate);

//subject to change
//router.get('/resettoken', isAdmin, electionController.resetToken);
//router.post('/reset', isAdmin, electionController.resetElection);

router.get('/election', isAdmin, dashboardController.electionDetails);
//router.get('/votes', isAdmin, dashboardController.getTotalVotes);

module.exports = router;