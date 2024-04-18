const db = require("../models/index.js");
const paillier = require("paillier-bigint");

function primeFactorization(number, primes) {
    let primeCounts = {};

    // initial counter value, so it will go over every prime in the 
    var counter = 0
    let prime = primes[counter];

    // Loop until the number is reduced to 1
    while (number > 1) {
        // If the current prime divides the number evenly
        if (number % prime === 0) {
            // Increase the count of the current prime factor
            if (primeCounts[prime]) {
                primeCounts[prime]++;
            } else {
                primeCounts[prime] = 1;
            }

            // Divide the number by the prime factor
            number /= prime;
        } else {
            // If the current prime doesn't divide the number evenly, move to the next prime
            counter += 1;
            prime = primes[counter];
        }
    }

    // Return the object containing counts of prime factors
    return primeCounts;
}

async function addToMajorityTally(electionId, adminPublicKey, candidatePrime)
{
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
    const tally = await db.tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        majorityTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e)
    {
        throw e;
    }

    var newSum;

    // If the tally has only been initialised and not yet encrypted by the publicKey
    if (tally.sum === BigInt(1))
    {
        const encryptedSum = await adminPublicKey.encrypt(tally.sum);
        newSum = await adminPublicKey.multiply(encryptedSum, candidatePrime);
        await tally.update({ sum: newSum });
    }
    else
    {
        newSum = await adminPublicKey.multiply(tally.sum, candidatePrime);
        await tally.update({ sum: newSum });
    }

    return newSum;
}

async function addToScoreTally(electionId, adminPublicKey, candidateScores)
{
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
    const tally = await db.tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try
    {
        scoreTallyChecker(rankTallies, scoreTallies, tally)
    }
    catch (e)
    {
        throw e;
    }

    const newSums = new Array();
    foreach(scoreTally in scoreTallies)
    {
        const scoreForCandidate = candidateScores[scoreTally.candidateId];
        if (typeof scoreForCandidate == 'undefined')
        {
            throw console.error(new Error ("No score included for one of the candidates in the election."))
        }

        // If the tally has only been initialised and not yet encrypted by the publicKey
        if (scoreTally.sum === BigInt(0))
        {
            const encryptedSum = await adminPublicKey.encrypt(scoreTally.sum);
            const encryptedScore = await adminPublicKey.encrypt(scoreForCandidate);
            newSum = await adminPublicKey.addition(encryptedSum, encryptedScore);
            
            newSums.push(newSum);
            await tally.update({ sum: newSum });
        }
        else
        {
            const encryptedScore = await adminPublicKey.encrypt(scoreForCandidate);
            newSum = await adminPublicKey.addition(encryptedSum, encryptedScore);

            newSums.push(newSum);
            await tally.update({ sum: newSum });
        }
    }

    return newSums;
}

async function addToRankTally(electionId, adminPublicKey, candidateRanks)
{
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
    const tally = await db.tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try 
    {
        rankTallyChecker(rankTallies, scoreTallies, tally)
    }
    catch (e)
    {
        throw e
    }

    const newSums = new Array();
    foreach(tally in rankTallies)
    {
        const candidateForRank = candidateRanks[tally.rank];
        if (typeof candidateForRank == 'undefined')
        {
            throw console.error(new Error ("No score included for one of the candidates in the election."))
        }

        // If the tally has only been initialised and not yet encrypted by the publicKey
        if (tally.sum === BigInt(1))
        {
            const encryptedSum = await adminPublicKey.encrypt(tally.sum);
            const newSum = await adminPublicKey.multiply(encryptedSum, candidateForRank);
            
            newSums.push(newSum);
            await tally.update({ sum: newSum });
        }
        else
        {
            const newSum = await adminPublicKey.multiply(tally.sum, candidateForRank);

            newSums.push(newSum);
            await tally.update({ sum: newSum });
        }

    return newSums;
    }
}

async function getMajorityTally(electionId, adminPrivateKey, candidatePrimes)
{
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
    const tally = await db.tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try
    {
        majorityTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e)
    {
        throw e;
    }

    const decryptedSum = await adminPrivateKey.decrypt(tally.sum);
    const decryptedSumAsInt = ParseInt(decryptedSum);
    const talliesForCandidates = primeFactorization(decryptedSumAsInt, candidatePrimes);

    return talliesForCandidates;
}

async function getScoreTally(electionId, adminPrivateKey, candidatePrimes)
{
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
    const tally = await db.tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        scoreTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e)
    {
        throw e;
    }

    var scoresForCandidates = {};

    foreach(scoreTally in scoreTallies)
    {
        const decryptedSum = await adminPrivateKey.decrypt(scoreTally.sum);
        const decryptedSumAsInt = ParseInt(decryptedSum);
        scoresForCandidates[scoreTally.candidateId] = decryptedSumAsInt;
    }

    return scoresForCandidates;
}

async function getRankTally(electionId, adminPrivateKey, candidatePrimes)
{
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
    const tally = await db.tally.findOne({
        where: {
            electionId: electionId,
        },
    })

    try {
        rankTallyChecker(rankTallies, scoreTallies, tally);
    }
    catch (e)
    {
        throw e;
    }

    var talliesForRank = {};

    foreach(rankTally in rankTallies)
    {
        const decryptedSum = await adminPrivateKey.decrypt(rankTally.sum);
        const decryptedSumAsInt = ParseInt(decryptedSum);
        const tallyForRank = primeFactorization(decryptedSumAsInt, candidatePrimes);
        talliesForRank[rankTally.preference] = tallyForRank;
    }

    return talliesForRank;
}

// helper function that can be reused in all Majority tally functions
function majorityTallyChecker(rankTallies, scoreTallies, tally)
{
    if (rankTallies.length != 0 || scoreTallies.length != 0)
    {
        throw new Error("Wrong voting process used for tally.");
    }
    else if (tally == null)
    {
        throw new Error("No tally associated with this election.");
    }
}

// helper function that can be resued in all Rank tally functions
function scoreTallyChecker(rankTallies, scoreTallies, tally)
{
    if (rankTallies.length != 0 || tally != null)
    {
        throw new Error("Wrong voting process used for tally.");
    }
    else if (scoreTallies.length == 0)
    {
        throw new Error("No tallies associated with this election.");
    }
}

function rankTallyChecker(rankTallies, scoreTallies, tally)
{
    if (scoreTallies.length != 0 || tally != null)
    {
        throw new Error("Wrong voting process used for tally.");
    }
    else if (rankTallies.length == 0)
    {
        throw new Error("No tallies associated with this election.");
    }
}

module.exports = { addToMajorityTally, addToRankTally, addToScoreTally, getMajorityTally, getRankTally }