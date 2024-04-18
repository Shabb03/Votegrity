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

    if (rankTallies.length != 0 || scoreTallies.length != 0)
    {
        return console.error(new Error("Wrong voting process used for tally."));
    }
    else if (tally == null)
    {
        return console.error(new Error("No tally associated with this election."));
    }
    else
    {
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

    if (rankTallies.length != 0 || tally != null)
    {
        throw console.error(new Error("Wrong voting process used for tally."));
    }
    else if (scoreTallies.length == 0)
    {
        throw console.error(new Error("No tallies associated with this election."));
    }
    else
    {
        const newSums = new Array();
        foreach(tally in scoreTallies)
        {
            const scoreForCandidate = candidateScores[tally.candidateId];
            if (typeof scoreForCandidate == 'undefined')
            {
                throw console.error(new Error ("No score included for one of the candidates in the election."))
            }

            // If the tally has only been initialised and not yet encrypted by the publicKey
            if (tally.sum === BigInt(0))
            {
                const encryptedSum = await adminPublicKey.encrypt(tally.sum);
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

    if (scoreTallies.length != 0 || tally != null)
    {
        throw console.error(new Error("Wrong voting process used for tally."));
    }
    else if (rankTallies.length == 0)
    {
        throw console.error(new Error("No tallies associated with this election."));
    }
    else
    {
        const newSums = new Array();
        foreach(tally in scoreTallies)
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
        }

        return newSums;
    }
}