const { decryptPassword } = require('./functions/password');
const db = require('../models/index.js');
const processes = require('../assets/process.json');
const paillier = require('paillier-bigint');
const { getMajorityTally, getScoreTally, getRankTally } = require('../middleware/tallyVotes');

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

async function getWinnerForMajorityTally(electionId, adminPrivateKey) {
    const results = await getMajorityTally(electionId, adminPrivateKey, primes)
};

async function getWinnerForRankTally(electionId, adminPrivateKey) {
    const results = await getRankTally(electionId, adminPrivateKey, primes)
};

async function getWinnerForScoreTally(electionId, adminPrivateKey) {
    const results = await getScoreTally(electionId, adminPrivateKey, primes)
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
        const adminPrivateKey = await keyFunctions.downloadPaillierKeysFromS3(admin.paillierPrivateKeyPath);

        //majority voting process
        if (electionType === processes[0]) {
            const winnerArray = await getWinnerForMajorityTally(electionId, adminPrivateKey);
            for (let candidateId in winnerArray) {
                await createResult(electionId, candidateId);
            }
        }
        //ranking voting process
        else if (electionType === processes[1]) {
            const winnerArray = await getWinnerForRankTally(electionId, adminPrivateKey);
            for (let candidateId in winnerArray) {
                await createResult(electionId, candidateId);
            }
        }
        //score based voting process
        else if (electionType === processes[2]) {
            const winnerArray = await getWinnerForScoreTally(electionId, adminPrivateKey);
            for (let candidateId in winnerArray) {
                await createResult(electionId, candidateId);
            }
        }

        election.isActive = false;
        await election.save();

        res.json({ message: 'Election results successfully published' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};