const { decryptPassword } = require('./functions/password');
const db = require('../models/index.js');
const processes = require('../assets/process.json');
const paillier = require('paillier-bigint');

const { Web3 } = require('web3');
const web3 = new Web3(process.env.API_URL);

const contractABI = require(process.env.CONTRACT_ABI);
const contractAddress = process.env.CONTRACT_ADDRESS;

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];


//y**x, find how many x's are in y, used to calculate the sum of ranks
async function extractArray(x, y) {
    const originalArray = [];
    let remainingY = y;
    for (let exponent = x; exponent >= 1; exponent--) {
        const currentPower = Math.pow(x, exponent);
        const count = Math.floor(remainingY / currentPower);
        originalArray.push(...Array(count).fill(exponent));
        remainingY -= count * currentPower;
    }
    const total = originalArray.reduce((total, num) => total + num, 0)
    return total;
};

//calculate the total rankings for each candidate
async function totalVotes(candidateIds, final) {
    const bigIntStr = final.toString();
    const result = {};
    const n = candidateIds.length;
    for (let i = 0; i < n; i++) {
        const start = -6 * (i + 1);
        const end = i === 0 ? 0 : -6 * i;
        const stringNum = end === 0 ? bigIntStr.slice(start) : bigIntStr.slice(start, end);
        const prime = primes[i]
        const num = await extractArray(prime, parseInt(stringNum));
        result[candidateIds[i]] = num;
    }
    return result;
};

//stv, decode the combined number to get the original rankings
async function decodeNumber(number) {
    let obj = {};
    let num = Number(number);
    primes.forEach((prime, index) => {
        let exponent = 0;
        while (num % prime === 0) {
            exponent++;
            num /= prime;
        }
        if (exponent > 0) {
            obj[prime] = exponent;
        }
    })
    return obj;
};

//used to count the number of primes in a number
function countPrimeDivisions(number, candidateIds) {
    const divisions = {};
    let num = BigInt(number);
    const n = candidateIds.length;
    for (let i = 0; i < n; i++) {
        const prime = BigInt(primes[n - i - 1]);
        let count = 0;
        while (num % prime === 0) {
            num /= prime;
            count++;
        }
        console.log("\ncount", count);
        if (count > 0) {
            divisions[candidateIds[i]] = count;
            console.log("\nif count > 0", candidateIds[i], count);
        }
    }
    return divisions;
};

async function publish1(votes, newPrivateKey) {

};

async function publish2(votes, newPrivateKey) {
    let sum = 0;
    for (let index in votes) {
        let vote = votes[index];
        const bigIntvote = BigInt(vote);
        let origSum = sum;
        if (sum === 0) {
            sum = bigIntvote;
        }
        else {
            sum = newPublicKey.multiply(origSum, bigIntvote); //does not work if one value is 0n
        }
    }
    const final = newPrivateKey.decrypt(sum);
    //const result = await totalVotes(candidateIds, final);
    const result = await countPrimeDivisions(final, candidateIds);

    let lowestCandidateId = Object.keys(result)[0];
    let lowestRanking = result[lowestCandidateId];
    for (const candidateId in result) {
        const totalRanking = result[candidateId];
        if (totalRanking < lowestRanking) {
            lowestRanking = totalRanking;
            lowestCandidateId = candidateId;
        }
    }
    const winner = [lowestCandidateId];
    return winner;
};

async function publish3(votes, newPrivateKey) {
    const totalSeats = 2;
    const tally = {};
    const winners = [];
    const totalVotes = preferences.length;
    const quota = Math.round(totalVotes / (totalSeats + 1)) + 1;
    for (let index in votes) {
        let vote = votes[index];
        const decryptedVote = await newPrivateKey.decrypt(vote);
        const orgVote = await decodeNumber(decryptedVote);
        for (const candidateId in orgVote) {
            tally[candidateId] = tally[candidateId] || 0;
        }
    }
    return winners;
};

async function publish4(votes, newPrivateKey) {

};

async function createResult(electionId, candidateId) {
    await db.Result.create({
        electionId: electionId,
        winner: candidateId,
    });
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
        const adminPrivateKey = admin.paillierPrivateKey;
        const publicKeyParts = adminPublicKey.split('#');
        const n = BigInt(publicKeyParts[0]);
        const g = BigInt(publicKeyParts[1]);
        const newPublicKey = new paillier.PublicKey(n, g);
        const privateKeyParts = adminPrivateKey.split('#');
        const lambda = BigInt(privateKeyParts[0]);
        const mu = BigInt(privateKeyParts[1]);
        const newPrivateKey = new paillier.PrivateKey(lambda, mu, newPublicKey);

        const candidates = await db.Candidate.findAll({
            where: { electionId: electionId },
            attributes: ['id'],
            order: [['id', 'ASC']]
        });
        const candidateIds = candidates.map(candidate => candidate.id);
        const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

        // get the votes
        //const votes = await contract.methods.getEncryptedVotes(electionId).call({ gas: 3000000 });


        //majority voting process
        if (electionType === processes[0]) {
            const winnerArray = await publish1(votes, newPrivateKey)
            for (let candidateId in winnerArray) {
                await createResult(electionId, candidateId);
            }
        }
        //ranking voting process
        else if (electionType === processes[1]) {
            const winnerArray = await publish2(votes, newPrivateKey)
            for (let candidateId in winnerArray) {
                await createResult(electionId, candidateId);
            }
        }
        //score based voting process
        else if (electionType === processes[2]) {
            const winnerArray = await publish3(votes, newPrivateKey)
            for (let candidateId in winnerArray) {
                await createResult(electionId, candidateId);
            }
        }
        //single-transferrable voting process
        else if (electionType === processes[3]) {
            const winnerArray = await publish4(votes, newPrivateKey)
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