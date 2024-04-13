const calculateAge = require('./functions/calculateAge');
const db = require('../models/index.js');
const Sequelize = require('sequelize');
const processes = require('../assets/process.json');
const keyFunctions = require('../middleware/keyFunctions.js');
const paillier = require('paillier-bigint');
const BlindSignature = require('blind-signatures');

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const dotenv = require('dotenv');
dotenv.config();

const { Web3 } = require('web3');
const web3 = new Web3(process.env.API_URL);

//const contractABI = require('../../blockchain/contract/artifacts/contracts/Vote.sol/Vote.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];


//check if the user is eleigible to vote for the election they are voting for
async function notEligible(userId, electionId) {
    const user = await db.Voter.findByPk(userId);
    const authenticatedUser = user.authenticated;
    if (!authenticatedUser) {
        return "User is not authenticated";
    }
    const election = await db.Election.findByPk(electionId);
    const age = calculateAge(user.dateOfBirth);
    const email = user.email;
    const emailAtIndex = email.indexOf('@');
    const emailDomain = email.substring(emailAtIndex);
    if (age < election.ageRestriction || (election.authEmail && emailDomain !== election.authEmail) || (election.authCitizenship && user.citizenship !== election.authCitizenship)) {
        return "You do not meet the voting requirements";
    }
    return null;
};

//check if the candidate exists
async function checkCandidate(candidateId) {
    if (!candidateId) {
        return "No candidate or election selected";
    }
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
        return "Selected candidate not found";
    }
    return null;
};

//check for any conflicting or missing ranks
async function checkRanks(ranks) {
    if (!ranks) {
        return "Vote rankings not provided";
    }
    const valueSet = new Set();
    for (const key in ranks) {
        const value = ranks[key];
        if (valueSet.has(value)) {
            return "Multiple candidates have the same ranking";
        }
        else {
            valueSet.add(value);
        }
    }
    return null;
};

//check all available points have been used
async function checkPoints(scores) {
    if (!scores) {
        return "Vote scores not provided";
    }
    let sum = 10;
    for (const key in scores) {
        const value = ranks[key];
        sum -= value;
    }
    if (sum !== 0) {
        return "All available score points must be used";
    }
    return null;
};

//for ranking system, combine the ranks into one bigint using primes to the power of ranks
function processObject(obj) {
    const size = Object.keys(obj).length - 1;
    const keys = Object.keys(obj).map(Number).sort((a, b) => b - a);
    const result = keys.map((key, i) => {
        const value = obj[key];
        const powered = BigInt(primes[size - i] ** value);
        const padded = powered.toString().padStart(6, '0');
        return padded;
    });
    return result.join(''); // Join the padded strings
}

//for stv system, using a complex mathemtaical formula and prime numbers, combine the ranks to be able to be decoded to it's original form
function encodeObject(obj) {
    let combinedNumber = 1;
    Object.keys(obj).forEach((key, index) => {
        combinedNumber *= Math.pow(primes[index], obj[key]);
    });
    return combinedNumber;
}

async function voteBlindSignature(adminPrivateKey, vote) {
    const parts = adminPrivateKey.split('#');
    const { blinded, r } = await BlindSignature.blind({
        message: vote.toString(),
        N: parts[0].toString(),
        E: parts[1].toString(),
    });
    //console.log(blinded, r);
    return blinded;
};

async function voteEncryptVote(adminPublicKey, vote) {
    const parts = adminPublicKey.split('#');
    const n = BigInt(parts[0]);
    const g = BigInt(parts[1]);
    const newPublicKey = new paillier.PublicKey(n, g);
    const encryptedVote = await newPublicKey.encrypt(vote);
    return encryptedVote.toString();
};

//voting process for majority voting
async function vote1(userId, candidateId, electionId, adminPrivateKey, adminPublicKey) {
    const vote = await db.Vote.create({
        voterId: userId,
        candidateId: candidateId,
        electionId: electionId,
    });
    const blindedSignature = vote.blindSignature(adminPrivateKey);
    const encryptedVote = vote.encryptVote(adminPublicKey);
    return { blindedSignature, encryptedVote };
};

//voting process for ranked voting
async function vote2(ranks, adminPrivateKey, adminPublicKey) {
    const processedStr = await processObject(ranks);
    const bigIntValue = BigInt(processedStr);
    const blindedSignature = await voteBlindSignature(adminPrivateKey, bigIntValue);
    const encryptedVote = await voteEncryptVote(adminPublicKey, bigIntValue);
    return { blindedSignature, encryptedVote };
};

//still needs a process
//voting process for score based voting
async function vote3(scores, adminPrivateKey, adminPublicKey) {
    //const blindedSignature = vote.blindSignature(adminPrivateKey, bigIntValue);
    //const encryptedVote = vote.encryptVote(adminPublicKey, bigIntValue);
    //return { blindedSignature, encryptedVote };
};

//voting process for single-transferrable voting
async function vote4(ranks, adminPrivateKey, adminPublicKey) {
    const encodedNumber = encodeObject(ranks);
    const bigIntValue = BigInt(encodedNumber);
    const blindedSignature = vote.blindSignature(adminPrivateKey, bigIntValue);
    const encryptedVote = vote.encryptVote(adminPublicKey, bigIntValue);
    return { blindedSignature, encryptedVote };
};

async function solContract(userId, electionId, encryptedVote, blindedSignature) {
    /*
    console.log("\n\n", encryptedVote);
    console.log("\n\n", encryptedVote.toString()); //length = 1233
    console.log("\n\n", blindedSignature);
    console.log("\n\n", blindedSignature.toString()); //length = 617
    console.log("\n\n", typeof blindedSignature);
    console.log("\n\n", BigInt(blindedSignature.toString()));
    */
    const bS = blindedSignature.toString();

    const user = await db.Voter.findByPk(userId);
    const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
    await contract.methods.registerVoter({ gasLimit: 2000000 }).send({ from: `${user.walletAddress}` })
        .on('receipt', receipt => {
            console.log(receipt);
        })
        .on('error', error => {
            console.error(error);
        });
    await contract.methods.submitBallot(encryptedVote, bS, electionId).send({ from: `${user.walletAddress}`, gas: 3000000 })
        .on('receipt', receipt => {
            console.log(receipt);
        })
        .on('error', error => {
            console.error(error);
        });
};

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
        return res.json({ candidates: candidatesByElection });
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
};

//Submit a vote cast by the user
exports.submitVote = async (req, res) => {
    //Work on this later to synchronize with the blockchain network
    try {
        const userId = req.user.id;
        const electionType = req.body.type;
        if (!processes.includes(electionType)) {
            return res.json({ error: 'Incorrect election type' });
        }
        const { electionId } = req.body;
        if (!electionId) {
            return res.json({ error: 'Incorrect election provided' });
        }
        const eligibility = await notEligible(userId, electionId);
        if (eligibility !== null) {
            return res.json({ error: eligibility });
        }

        const election = await db.Election.findByPk(electionId);
        const admin = await db.Admin.findByPk(election.adminId);
        //const bucketName = "votegritybucket2";
        //const encryptedAdminPrivateKey = keyFunctions.downloadEncryptedAdminKeysFromS3(bucketName, admin.privateKeyPath);
        //const adminPrivateKey = keyFunctions.decryptAdminKey(encryptedAdminPrivateKey)

        const adminPublicKey = admin.paillierPublicKey;
        const adminPrivateKey = admin.blindPrivateKey;

        //majority voting process
        if (electionType === processes[0]) {
            const { candidateId } = req.body;
            const cand = await checkCandidate(candidateId);
            if (cand !== null) {
                return res.json({ error: cand });
            }
            const { blindedSignature, encryptedVote } = await vote1(userId, candidateId, electionId, adminPrivateKey, adminPublicKey);
            solContract(userId, electionId, encryptedVote, blindedSignature);
            return res.json({ message: 'Vote submitted successfully' });
        }
        //ranking voting process
        else if (electionType === processes[1]) {
            const { ranks } = req.body;
            const checkRank = await checkRanks(ranks);
            if (checkRank !== null) {
                return res.json({ error: checkRank });
            }
            const { blindedSignature, encryptedVote } = await vote2(ranks, adminPrivateKey, adminPublicKey);
            await solContract(userId, electionId, encryptedVote, blindedSignature);
            return res.json({ message: 'Vote submitted successfully' });
        }
        //score based voting process
        else if (electionType === processes[2]) {
            const { scores } = req.body;
            const checkScore = await checkPoints(scores);
            if (checkScore !== null) {
                return res.json({ error: checkScore });
            }
            const { blindedSignature, encryptedVote } = await vote3(scores, adminPrivateKey, adminPublicKey);
            solContract(userId, electionId, encryptedVote, blindedSignature);
            return res.json({ message: 'Vote submitted successfully' });
        }
        //single-transferrable voting process
        else if (electionType === processes[3]) {
            const { ranks } = req.body;
            const checkRank = await checkRanks(ranks);
            if (checkRank !== null) {
                return res.json({ error: checkRank });
            }
            const { blindedSignature, encryptedVote } = await vote4(ranks, adminPrivateKey, adminPublicKey);
            solContract(userId, electionId, encryptedVote, blindedSignature);
            return res.json({ message: 'Vote submitted successfully' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};