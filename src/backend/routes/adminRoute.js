const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isadmin');

const multer = require('multer');
const path = require('path');

//used to send images via a get request
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
const resultController = require('../controllers/resultController');

router.post('/login', loginController.adminLogin);

router.post('/addelection', isAdmin, electionController.addElection);
router.get('/newelections', isAdmin, electionController.getNewElections);
router.post('/addcandidate', isAdmin, upload.single('image'), electionController.addCandidate);

router.get('/election', isAdmin, dashboardController.electionDetails);

router.get('/activeelections', isAdmin, resultController.getActiveElections);
router.post('/publishresults', isAdmin, resultController.publishResults);

//subject to change
//router.get('/resettoken', isAdmin, electionController.resetToken);  //yet to test
//router.post('/reset', isAdmin, electionController.resetElection);  //yet to test

module.exports = router;