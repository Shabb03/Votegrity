const calculateAge = require('./functions/calculateAge');
const db = require('../models/index.js');
const Sequelize = require('sequelize');
const processes = require('../assets/process.json');
const keyFunctions = require('../middleware/keyFunctions.js');
const paillier = require('paillier-bigint');
const BlindSignature = require('blind-signatures');
const { addToMajorityTally, addToRankTally, addToScoreTally } = require('../middleware/tallyVotes');
const { blindVote, signVote, encryptVote, decryptVote } = require('../middleware/voteFunctions')

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const dotenv = require('dotenv');
dotenv.config();

const { Web3 } = require('web3');
const web3 = new Web3(process.env.API_URL);

const contractABI = require(process.env.CONTRACT_ABI);
const contractAddress = process.env.CONTRACT_ADDRESS;

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];


function countPrimeDivisions(number, candidateIds) {
    const divisions = {};
    let num = BigInt(number);
    const n = candidateIds.length;
    for (let i = 0; i < n; i++) {
        const prime = BigInt(primes[n - i - 1]);
        let count = 0;
        while (num % prime === 0n) {
            num /= prime;
            count++;
        }
        if (count > 0) {
            divisions[candidateIds[i]] = count;
        }
    }
    return divisions;
};

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
async function checkCandidate(candidateId, electionId) {
    if (!candidateId) {
        return "No candidate or election selected";
    }
    const candidate = await db.Candidate.findByPk(candidateId);
    if (!candidate || candidate.electionId != electionId) {
        return "Selected candidate not found or not available for this election";
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

//check if all candidates exists
async function checkCandidates(candidateIds, electionId) {
    if (candidateIds.length == 0 || !electionId) {
        return "No candidate or election selected";
    }

    foreach(candidateId in candidateIds)
    {
        const candidate = await db.Candidate.findByPk(ParseInt(candidateId));
        if (!candidate || candidate.electionId != electionId) {
            return "Selected candidate not found or not available for this election";
        }
    }
    return null;
};

async function convertIdsToPrimes(candidateIds) {
    const ranksAsPrimes = {};
    foreach(candidateId in candidateIds)
    {
        const candidate = await db.Candidate.findByPk(ParseInt(candidateId));
        ranksAsPrimes[candidate.primeNumber] = ranks[candidate.id];
    }

    return ranksAsPrimes;
}

//for ranking system, combine the ranks into one bigint using primes to the power of ranks
function calculateProduct(obj) {
    let combinedNumber = 1;
    Object.keys(obj).forEach((key, index) => {
        combinedNumber *= Math.pow(primes[index], obj[key]);
    });
    return combinedNumber;
}

//voting process for majority voting
async function majorityVote(userId, candidatePrime, electionId, paillierPublicKey, blindPublicKey, blindPrivateKey) {
    const { blinded, r } = await blindVote(blindPublicKey, candidatePrime);
    const signedVote = await signVote(blindPrivateKey, blinded);
    const encryptedVote = await encryptVote(paillierPublicKey, candidatePrime);

    try {
        const tallySum = await addToMajorityTally(electionId, paillierPublicKey, candidatePrime);
    }
    catch (e) {
        console.error(e);
    }

    const vote = await db.Vote.create({
        userId: userId,
        electionId: electionId,
        blindedSignature: signedVote,
        r: r,
        encryptedVote: encryptedVote
    })
    vote.save();

    return { signedVote, encryptedVote };
};

//voting process for ranked voting
async function rankVote(ranks, paillierPublicKey, blindPublicKey, blindPrivateKey) {
    //const processedStr = await processObject(ranks);
    const processedStr = await calculateProduct(ranks);
    const bigIntValue = BigInt(processedStr);

    const { blinded, r } = blindVote(blindPublicKey, bigIntValue);
    const signedVote = signVote(blindPrivateKey, blinded)
    const encryptedVote = await encryptVote(paillierPublicKey, bigIntValue);

    try {
        const tallySum = await addToRankTally(electionId, paillierPublicKey, ranks);
    }
    catch (e) {
        console.error(e);
    }

    const vote = await db.Vote.create({
        userId: userId,
        electionId: electionId,
        blindedSignature: signedVote,
        r: r,
        encryptedVote: encryptedVote
    })
    vote.save();

    return { signedVote, encryptedVote };
};

//voting process for score-based voting
async function scoreVote(scores, paillierPublicKey, blindPublicKey, blindPrivateKey) {
    // not sure what value to use to encrypt and blind for scores
    const { blinded, r } = blindVote(blindPublicKey, bigIntValue);
    const signedVote = signVote(blindPrivateKey, blinded)
    const encryptedVote = await encryptVote(paillierPublicKey, bigIntValue);

    try {
        const tallySum = await addToScoreTally(electionId, paillierPublicKey, scores);
    }
    catch (e) {
        console.error(e);
    }

    const vote = await db.Vote.create({
        userId: userId,
        electionId: electionId,
        blindedSignature: signedVote,
        r: r,
        encryptedVote: encryptedVote
    })
    vote.save();

    return { signedVote, encryptedVote };
};

async function solContract(userId, electionId, encryptedVote, blindedSignature) {
    const bS = blindedSignature.toString();

    const user = await db.Voter.findByPk(userId);
    const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

    try {
        await contract.methods.submitBallot(encryptedVote, bS, electionId).send({ from: `${user.walletAddress}`, gas: 3000000 })
            .on('receipt', receipt => {
                console.log(receipt);
            })
            .on('error', error => {
                console.error(error);
            });
        return true;
    }
    catch (error) {
        return false;
    }
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
            const vote = await db.Vote.findOne({
                where: {
                    electionId: election.id,
                    userId: userId
                }
            })
            if (vote) {
                const voteElection = await db.Election.findByPk(election.id);
                const admin = await db.Admin.findByPk(voteElection.adminId);
                const adminPrivateKey = await keyFunctions.downloadPaillierKeysFromS3(admin.paillierPrivateKeyPath);
                const decryptedVote = await decryptVote(adminPrivateKey, encryptedVote);
                if (voteElection.type === processes[0]) {
                    const candidates = await db.Candidate.findOne({
                        where: {
                            electionId: election.id,
                            primeNumber: decryptedVote
                        },
                        attributes: ['id', 'name', 'voice', 'party', 'dateOfBirth', 'biography'],
                    })
                    return {
                        id: election.id,
                        title: election.title,
                        type: 'voted',
                        candidates,
                    };
                }
                else if (voteElection.type === processes[1]) {
                    const candPrimes = await db.Candidate.findAll({
                        where: { electionId: election.id },
                        attributes: ['id', 'primeNumbers'],
                    });
                    const primeNumbersArray = candPrimes.map(candidate => candidate.primeNumbers);
                    const allPrimeNumbers = primeNumbersArray.flat();
                    allPrimeNumbers.sort((a, b) => a - b);
                    const voteObj = countPrimeDivisions(decryptedVote, allPrimeNumbers)
                    const keyValueArray = Object.entries(voteObj);
                    keyValueArray.sort((a, b) => a[1] - b[1]);
                    const candidates = await db.Candidate.findAll({
                        where: {
                            electionId: election.id,
                            primeNumber: { [Op.in]: keyValueArray }
                        },
                        attributes: ['id', 'name', 'voice', 'party', 'dateOfBirth', 'biography'],
                    });
                    return {
                        id: election.id,
                        title: election.title,
                        type: 'voted',
                        candidates,
                    };
                }
                else if (voteElection.type === processes[2]) {
                    const candPrimes = await db.Candidate.findAll({
                        where: { electionId: election.id },
                        attributes: ['id', 'primeNumbers'],
                    });
                    const primeNumbersArray = candPrimes.map(candidate => candidate.primeNumbers);
                    const allPrimeNumbers = primeNumbersArray.flat();
                    allPrimeNumbers.sort((a, b) => a - b);
                    const voteObj = countPrimeDivisions(decryptedVote, allPrimeNumbers)
                    const keyValueArray = Object.entries(voteObj);
                    keyValueArray.sort((a, b) => a[1] - b[1]);
                    const candidates = await db.Candidate.findAll({
                        where: {
                            electionId: election.id,
                            primeNumber: { [Op.in]: keyValueArray }
                        },
                        attributes: ['id', 'name', 'voice', 'party', 'dateOfBirth', 'biography'],
                    });
                    return {
                        id: election.id,
                        title: election.title,
                        type: 'voted',
                        candidates,
                    };
                }
            }
            else {
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
            }
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

        const paillierPublicKey = admin.paillierPublicKey;
        const blindPublicKey = admin.blindPublicKey;
        const blindPrivateKey = await keyFunctions.downloadBlindKeysFromS3(admin.blindPrivateKeyPath);

        //majority voting process
        if (electionType === processes[0]) {
            const { candidateId } = req.body;
            const cand = await checkCandidate(candidateId, electionId);
            if (cand !== null) {
                return res.json({ error: cand });
            }
            const candidate = db.Candidate.findByPk(candidateId);
            const { signedVote, encryptedVote } = await majorityVote(userId, candidate.primeNumber, electionId, paillierPublicKey, blindPublicKey, blindPrivateKey);
            const submitted = await solContract(userId, electionId, encryptedVote, signedVote);
            if (!submitted) {
                return res.json({ error: 'Ballot already cast' });
            }
            return res.json({ message: 'Vote submitted successfully' });
        }
        //ranking voting process
        else if (electionType === processes[1]) {
            const { ranks } = req.body;
            const checkRank = await checkRanks(ranks);
            if (checkRank !== null) {
                return res.json({ error: checkRank });
            }

            const candidateIds = ranks.keys();
            const checkCandidates = await checkCandidates(candidateIds, electionId)
            {
                if (checkCandidates !== null) {
                    return res.json({ error: checkCandidates });
                }
            }
            const ranksWithPrimes = await convertIdsToPrimes(candidateIds);

            const { signedVote, encryptedVote } = await rankVote(ranksWithPrimes, paillierPublicKey, blindPublicKey, blindPrivateKey);
            const submitted = await solContract(userId, electionId, encryptedVote, signedVote);
            if (!submitted) {
                return res.json({ error: 'Ballot already cast' });
            }
            return res.json({ message: 'Vote submitted successfully' });
        }
        //score based voting process
        else if (electionType === processes[2]) {
            const { scores } = req.body;
            const checkScore = await checkPoints(scores);
            if (checkScore !== null) {
                return res.json({ error: checkScore });
            }
            const candidateIds = scores.keys();
            const checkCandidates = await checkCandidates(candidateIds, electionId)
            {
                if (checkCandidates !== null) {
                    return res.json({ error: checkCandidates });
                }
            }

            const { blindedSignature, encryptedVote } = await scoreVote(scores, paillierPublicKey, blindPublicKey, blindPrivateKey);
            const submitted = await solContract(userId, electionId, encryptedVote, blindedSignature);
            if (!submitted) {
                return res.json({ error: 'Ballot already cast' });
            }
            return res.json({ message: 'Vote submitted successfully' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};