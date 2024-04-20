const db = require("../models/index.js");
const paillier = require("paillier-bigint");

function primeFactorization(number, primes) {
    let primeCounts = {};

    // initial counter value, so it will go over every prime in the 
    var counter = 0
    let prime = BigInt(primes[counter]);

    // Loop until the number is reduced to 1
    while (number > 1) {
        // If the current prime divides the number evenly
        if (number % prime === 0n) {
            // Increase the count of the current prime factor
            if (primeCounts[prime]) {
                primeCounts[prime]++;
            }
            else {
                primeCounts[prime] = 1;
            }

            // Divide the number by the prime factor
            number /= prime;
        } else {
            // If the current prime doesn't divide the number evenly, move to the next prime
            counter += 1;
            prime = BigInt(primes[counter]);
        }
    }
    // Return the object containing counts of prime factors
    return primeCounts;
}

async function addToMajorityTally(electionId, adminPublicKey, candidatePrime) {
    const rankTallies = await db.RankTally.findAll({
        where: {
            electionId: electionId,
        }
    });
    const scoreTallies = await db.ScoreTally.findAll({
        where: {
            electionId: electionId,
        },
    });
    const tally = await db.Tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        await majorityTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e) {
        throw e;
    }

    var newSum;

    // If the tally has only been initialised and not yet encrypted by the publicKey
    if (tally.sum === 1 || tally.sum === '1') { tally.sum = BigInt(1); }
    if (tally.sum === BigInt(1)) {
        const tallySum = BigInt(tally.sum);
        const encryptedSum = await adminPublicKey.encrypt(tallySum);
        newSum = await adminPublicKey.multiply(encryptedSum, candidatePrime);
        await tally.update({ sum: newSum }, { where: { id: tally.id } });
    }
    else {
        const tallySum = BigInt(tally.sum);
        newSum = await adminPublicKey.multiply(tallySum, candidatePrime);
        await tally.update({ sum: newSum }, { where: { id: tally.id } });
    }

    return newSum;
}

async function addToScoreTally(electionId, adminPublicKey, candidateScores) {
    const rankTallies = await db.RankTally.findAll({
        where: {
            electionId: electionId,
        }
    });
    const scoreTallies = await db.ScoreTally.findAll({
        where: {
            electionId: electionId,
        },
    });
    const tally = await db.Tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        await scoreTallyChecker(rankTallies, scoreTallies, tally)
    }
    catch (e) {
        throw e;
    }

    const newSums = new Array();
    for (const index in scoreTallies) {
        const scoreTally = scoreTallies[index];
        const scoreForCandidate = candidateScores[scoreTally.candidateId];
        if (typeof scoreForCandidate == 'undefined') {
            throw console.error(new Error("No score included for one of the candidates in the election."))
        }

        // If the tally has only been initialised and not yet encrypted by the publicKey
        if (scoreTally.sum === 0 || scoreTally.sum === '0') { scoreTally.sum = BigInt(0); }
        if (scoreTally.sum === BigInt(0)) {
            const encryptedSum = await adminPublicKey.encrypt(scoreTally.sum);
            const encryptedScore = await adminPublicKey.encrypt(BigInt(scoreForCandidate));
            let newSum = await adminPublicKey.addition(encryptedSum, encryptedScore);

            newSums.push(newSum);
            await scoreTally.update({ sum: newSum }, { where: { id: scoreTally.id } });
        }
        else {
            //const encryptedSum = await adminPublicKey.encrypt(BigInt(scoreTally.sum));
            const encryptedScore = await adminPublicKey.encrypt(BigInt(scoreForCandidate));
            let newSum = await adminPublicKey.addition(BigInt(scoreTally.sum), encryptedScore);

            newSums.push(newSum);
            await scoreTally.update({ sum: newSum }, { where: { id: scoreTally.id } });
        }
    }
    return newSums;
}

async function addToRankTally(electionId, adminPublicKey, candidateRanks) {
    const rankTallies = await db.RankTally.findAll({
        where: {
            electionId: electionId,
        }
    });
    const scoreTallies = await db.ScoreTally.findAll({
        where: {
            electionId: electionId,
        },
    });
    const tally = await db.Tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        await rankTallyChecker(rankTallies, scoreTallies, tally)
    }
    catch (e) {
        throw e
    }

    const newSums = new Array();
    for (const index in rankTallies) {
        const tally = rankTallies[index];
        const candidateForRank = Object.keys(candidateRanks).find(key => candidateRanks[key] === tally.rank);
        if (typeof candidateForRank == 'undefined') {
            throw new Error("No rank included for one of the candidates in the election.");
        }

        // If the tally has only been initialised and not yet encrypted by the publicKey
        if (tally.sum === 1 || tally.sum === '1') { tally.sum = BigInt(1); }
        if (tally.sum === BigInt(1)) {
            const encryptedSum = await adminPublicKey.encrypt(tally.sum);
            const newSum = await adminPublicKey.multiply(encryptedSum, BigInt(candidateForRank));

            newSums.push(newSum);
            await tally.update({ sum: newSum }, { where: { id: tally.id } });
        }
        else {
            const newSum = await adminPublicKey.multiply(BigInt(tally.sum), BigInt(candidateForRank));

            newSums.push(newSum);
            await tally.update({ sum: newSum }, { where: { id: tally.id } });
        }
    }
    return newSums;
}

async function getMajorityTally(electionId, adminPrivateKey, candidatePrimes) {
    const rankTallies = await db.RankTally.findAll({
        where: {
            electionId: electionId,
        }
    });
    const scoreTallies = await db.ScoreTally.findAll({
        where: {
            electionId: electionId,
        },
    });
    const tally = await db.Tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        await majorityTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e) {
        throw e;
    }

    const tallySum = BigInt(tally.sum);
    const decryptedSum = await adminPrivateKey.decrypt(tallySum);
    const talliesForCandidates = primeFactorization(decryptedSum, candidatePrimes);

    return talliesForCandidates;
}

async function getScoreTally(electionId, adminPrivateKey, candidatePrimes) {
    const rankTallies = await db.RankTally.findAll({
        where: {
            electionId: electionId,
        }
    });
    const scoreTallies = await db.ScoreTally.findAll({
        where: {
            electionId: electionId,
        },
    });
    const tally = await db.Tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        await scoreTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e) {
        throw e;
    }

    var scoresForCandidates = {};
    for (const index in scoreTallies) {
        const scoreTally = scoreTallies[index];
        const tallySum = BigInt(scoreTally.sum);
        const decryptedSum = await adminPrivateKey.decrypt(tallySum);
        const decryptedSumAsInt = Number(decryptedSum);
        scoresForCandidates[scoreTally.candidateId] = decryptedSumAsInt;
    }

    return scoresForCandidates;
}

async function getRankTally(electionId, adminPrivateKey, candidatePrimes) {
    const rankTallies = await db.RankTally.findAll({
        where: {
            electionId: electionId,
        }
    });
    const scoreTallies = await db.ScoreTally.findAll({
        where: {
            electionId: electionId,
        },
    });
    const tally = await db.Tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        await rankTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e) {
        throw e;
    }

    var talliesForRank = [];
    for (const index in rankTallies) {
        const rankTally = rankTallies[index];
        const tallySum = BigInt(rankTally.sum);
        const decryptedSum = await adminPrivateKey.decrypt(tallySum);
        const tallyForRank = primeFactorization(decryptedSum, candidatePrimes);
        talliesForRank.push(tallyForRank);
    }

    return talliesForRank;
}

// helper function that can be reused in all Majority tally functions
function majorityTallyChecker(rankTallies, scoreTallies, tally) {
    if (rankTallies.length != 0 || scoreTallies.length != 0) {
        throw new Error("Wrong voting process used for tally.");
    }
    else if (tally == null) {
        throw new Error("No tally associated with this election.");
    }
}

// helper function that can be resued in all Rank tally functions
function scoreTallyChecker(rankTallies, scoreTallies, tally) {
    if (rankTallies.length != 0 || tally != null) {
        throw new Error("Wrong voting process used for tally.");
    }
    else if (scoreTallies.length == 0) {
        throw new Error("No tallies associated with this election.");
    }
}

function rankTallyChecker(rankTallies, scoreTallies, tally) {
    if (scoreTallies.length != 0 || tally != null) {
        throw new Error("Wrong voting process used for tally.");
    }
    else if (rankTallies.length == 0) {
        throw new Error("No tallies associated with this election.");
    }
}

module.exports = { addToMajorityTally, addToRankTally, addToScoreTally, getMajorityTally, getScoreTally, getRankTally }