const { decryptPassword } = require('./functions/password');
const db = require('../models/index.js');
const processes = require('../assets/process.json');
const paillier = require('paillier-bigint');
const { getMajorityTally, getScoreTally, getRankTally } = require('../middleware/tallyVotes');
const { downloadPaillierKeysFromS3 } = require('../middleware/keyFunctions')

const { Web3 } = require('web3');
const web3 = new Web3(process.env.API_URL);

const contractABI = require(process.env.CONTRACT_ABI);
const contractAddress = process.env.CONTRACT_ADDRESS;

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

//used to count the number of primes in a number
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

async function getWinnerForMajorityTally(electionId, adminPrivateKey, candidatePrimes) {
    const tallySum = await getMajorityTally(electionId, adminPrivateKey, candidatePrimes);
    const winningCandidates = new Array();
    let winnerPrime;

    // get the highest value in the tallySum object
    let arr = Object.values(tallySum);
    let highestTally = Math.max(...arr);

    for (const key in tallySum) {
        if (tallySum[key] === highestTally) {
            winningCandidates.push(Number(key));
        }
    }

    if (winningCandidates.length > 1) {
        // Randomly choose a winner because they have the same amount of votes
        winnerPrime = winningCandidates[(Math.floor(Math.random() * winningCandidates.length))]
    }
    else {
        winnerPrime = winningCandidates[0];
    }
    return winnerPrime
};

async function getWinnerForScoreTally(electionId, adminPrivateKey) {
    const tallySum = await getScoreTally(electionId, adminPrivateKey);
    const winningCandidates = new Array();
    let winnerId;

    // get the highest value in the tallySum object
    let arr = Object.values(tallySum);
    let highestTally = Math.max(...arr);

    for (const key in tallySum) {
        if (tallySum[key] === highestTally) {
            winningCandidates.push(Number(key));
        }
    }

    if (winningCandidates.length > 1) {
        // Randomly choose a winner because they have the same amount of votes
        winnerId = winningCandidates[(Math.floor(Math.random() * winningCandidates.length))]
    }
    else {
        winnerId = winningCandidates[0];
    }

    return winnerId;

};

async function getWinnerForRankTally(electionId, adminPrivateKey, candidatePrimes) {
    const tallySums = await getRankTally(electionId, adminPrivateKey, candidatePrimes);
    const winningCandidates = new Array();
    let winnerPrime;
    const rank = "rank";

    const candiateTotalScores = {};
    for (const index in candidatePrimes) {
        const candidatePrime = candidatePrimes[index];
        let candidateTotalTally = 0
        tallySums.forEach(obj => {
            const value = obj[candidatePrime] || 0;
            const rank = obj.rank;
            candidateTotalTally += (tallySums.length - rank + 1) * 5 * value;
        });
        candiateTotalScores[candidatePrime] = candidateTotalTally;
    }

    let arr = Object.values(candiateTotalScores);
    let highestTally = Math.max(...arr);

    for (const key in candiateTotalScores) {
        if (candiateTotalScores[key] === highestTally) {
            winningCandidates.push(Number(key));
        }
    }

    if (winningCandidates.length > 1) {
        // Randomly choose a winner because they have the same amount of votes
        winnerPrime = winningCandidates[(Math.floor(Math.random() * winningCandidates.length))]
    }
    else {
        winnerPrime = winningCandidates[0];
    }

    return winnerPrime
};

async function createResult(electionId, candidateId) {
    const result = await db.Result.create({
        electionId: electionId,
        winner: candidateId,
    });

    result.save();
    return result;
}

//get all active elections
exports.getActiveElections = async (req, res) => {
    try {
        const activeElections = await db.Election.findAll({
            attributes: ['id', 'title', 'resultDate'],
            where: {
                isActive: true,
            },
            order: [['resultDate', 'DESC']],
        });
        res.json({ activeElections: activeElections });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Publish the results of the election and make it inactive
exports.publishResults = async (req, res) => {
    try {
        const { electionId, publishKey } = req.body;
        const election = await db.Election.findByPk(electionId);

        if (!election || !election.isActive) {
            res.json({ error: 'Active Election not found' });
        }
        const decryptedKey = await decryptPassword(publishKey);
        if (decryptedKey !== election.publishKey) {
            res.json({ error: 'Incorrect publish key provided' });
        }
        const electionType = election.type;

        const admin = await db.Admin.findByPk(election.adminId);
        const adminPublicKey = admin.paillierPublicKey;
        const adminPublicKeyAsJSON = JSON.parse(adminPublicKey);
        const paillierPrivateKey = await downloadPaillierKeysFromS3(admin.paillierPrivateKeyPath);
        const paillierPublicKey = new paillier.PublicKey(BigInt(adminPublicKeyAsJSON.n), BigInt(adminPublicKeyAsJSON.g));

        const candidates = await db.Candidate.findAll({
            where: { electionId: electionId },
            attributes: ['id', 'primeNumber'],
            order: [['id', 'ASC']]
        });
        const candidatePrimes = candidates.map(candidate => candidate.primeNumber);
        const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

        //majority voting process
        if (electionType === processes[0]) {
            const winnerPrime = await getWinnerForMajorityTally(electionId, paillierPrivateKey, candidatePrimes);
            const candidate = candidates.find((candidate) => candidate.primeNumber === winnerPrime);
            const winnerId = candidate.id;
            await createResult(electionId, winnerId);
        }
        //ranking voting process
        else if (electionType === processes[1]) {
            const winnerPrime = await getWinnerForRankTally(electionId, paillierPrivateKey, candidatePrimes);
            const candidate = candidates.find((candidate) => candidate.primeNumber === winnerPrime);
            const winnerId = candidate.id;
            await createResult(electionId, winnerId);
        }
        //score based voting process
        else if (electionType === processes[2]) {
            const winnerId = await getWinnerForScoreTally(electionId, paillierPrivateKey)
            await createResult(electionId, winnerId);
        }

        election.isActive = false;
        await election.save();

        return res.json({ message: 'Election results successfully published' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};