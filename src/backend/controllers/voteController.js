const calculateAge = require('./functions/calculateAge');
const db = require('../models/index.js');
const Sequelize = require('sequelize');
const processes = require('../assets/process.json');

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const keyFunctions = require('../middleware/keyFunctions.js')

//const contractABI = require('../../blockchain/contract/artifacts/contracts/Vote.sol/Vote.json');
const contractAddress = '0x0xE4cbd0825a4A2673d00196d8172e1E5DA359F3D6';

const dotenv = require('dotenv');
dotenv.config();

const { Web3 } = require('web3');
const web3 = new Web3(process.env.API_URL);

//Get the details of all candidates in the current election
exports.getAllCandidates = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);

        const age = calculateAge(user.dateOfBirth);
        const email = user.email;
        const emailAtIndex = email.indexOf('@');
        const emailDomain = email.substring(emailAtIndex);

        const activeElections = await db.Election.findAll({
            where: {
                isActive: true,
                ageRestriction: { [Sequelize.Op.lte]: age },
                [Sequelize.Op.or]: [
                    { authEmail: { [Sequelize.Op.is]: null } },
                    { authEmail: emailDomain },
                ],
                [Sequelize.Op.or]: [
                    { authCitizenship: { [Sequelize.Op.is]: null } },
                    { authCitizenship: user.citizenship },
                ],
            },
            attributes: ['id', 'title', 'type'],
            order: [['resultDate', 'DESC']],
        });

        const candidatesByElection = await Promise.all(activeElections.map(async (election) => {
            const candidates = await db.Candidate.findAll({
                where: { electionId: election.id },
                attributes: ['id', 'name', 'voice', 'party', 'dateOfBirth', 'biography'],
            });
            return {
                id: election.id,
                title: election.title,
                type: election.type,
                candidates,
            };
        }));
        return res.json({candidates: candidatesByElection});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Get the image of a candidate given their id
exports.getImage = async (req, res) => {
    try {
        const { id } = req.params;
        const candidate = await db.Candidate.findByPk(id);
        if (!candidate) {
            return res.json({ message: 'Candidate not found' });
        }
        const imagePath = path.join(__dirname, "../images/", candidate.image);
        const imageData = await readFileAsync(imagePath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageData);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Submit a vote cast by the user
exports.submitVote = async (req, res) => {
    //Work on this later to synchronize with the blockchain network
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);
        const authenticatedUser = user.authenticated;
        if (!authenticatedUser) {
            return res.json({error: 'User is not authenticated', authenticated: false});
        }
        const electionType = req.body.type;
        if (!processes.includes(electionType)) {
            return res.json({error: 'Incorrect election type'});
        }
        const { electionId } = req.body;
        const election = db.Election.findByPk(electionId);
        const age = calculateAge(user.dateOfBirth);
        const email = user.email;
        const emailAtIndex = email.indexOf('@');
        const emailDomain = email.substring(emailAtIndex);
        if (age < election.ageRestriction || (election.authEmail && emailDomain !== election.authEmail) || (election.authCitizenship && user.citizenship !== election.authCitizenship)) {
            return res.json({error: 'You do not meet the voting requirements'});
        }

        //if and else statements for election type
        if (electionType ===  processes[0]) {
            //majority vote contract
            const { candidateId } = req.body;
            if (!candidateId || !electionId) {
                return res.json({error: 'No candidate or election selected'});
            }
            const candidate = await Candidate.findByPk(candidateId);
            if (!candidate) {
                return res.json({error: 'Selected candidate not found'});
            }
            /*
            const vote = await Vote.create({
                voterId: userId,
                candidateId: candidateId,
                electionId: electionId,
            });
            */
        }
        else if (electionType === processes[1]) {
            //ranking vote contract
            const { ranks } = req.body;
            if (!ranks) {
                return res.json({error: 'Vote rankings not provided'});
            }
            const valueSet = new Set();
            for (const key in ranks) {
                const value = ranks[key];
                if (valueSet.has(value)) {
                    return res.json({error: 'Multiple candidates have the same ranking'});
                } 
                else {
                    valueSet.add(value);
                }
            }
        }
        else if (electionType === processes[2]) {
            //score based vote contract
            const { scores } = req.body;
            if (!scores) {
                return res.json({error: 'Vote scores not provided'});
            }
            let sum = 100
            for (const key in scores) {
                const value = ranks[key];
                sum -= value;
            }
            if (sum !== 0) {
                return res.json({error: 'All available score points must be used'});
            }
        }
        
        const admin = await db.Admin.findOne({ where: { electionId: user.electionId } });

        const bucketName = "votegritybucket";
        const encryptedAdminPrivateKey = keyFunctions.downloadEncryptedAdminKeysFromS3(bucketName, admin.privateKeyPath);
        const adminPrivateKey = keyFunctions.decryptAdminKey(encryptedAdminPrivateKey)
        const adminPublicKey = admin.paillierPublicKey;
        
        const vote = await db.Vote.create({
            voterId: userId,
            candidateId: candidateId,
            electionId: electionId,
        });

        const blindedSignature = vote.blindSignature(adminPrivateKey);
        const encryptedVote = vote.encryptVote(adminPublicKey);

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        contract.methods.submitBallot(encryptedVote, blindedSignature)
        .send({ from: '${user.walletAddress}' })
        .on('receipt', receipt => {
            console.log(receipt);
        })
        .on('error', error => {
            console.error(error);
        });

        res.json({ message: 'Vote submitted successfully'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};