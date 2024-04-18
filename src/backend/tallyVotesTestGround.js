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



async function test()
{

const { publicKey, privateKey } = await paillier.generateRandomKeys(2048);
// candidates represented by their Ids and associated prime numbers
candidates = {
    1: 2,
    2: 3,
    3: 5
}

// candidate 1 = 3 votes candidate 2 = 2 vote, candidate 3 = 0 vote.
const vote1 =candidates[3];
const bigIntVote1 = BigInt(vote1);
const encryptedVote1 = publicKey.encrypt(bigIntVote1);

const vote2 = candidates[1];
const encryptedVote2 = publicKey.encrypt(BigInt(vote2));

const vote3 = candidates[1];
const encryptedVote3 = publicKey.encrypt(BigInt(vote3));

const vote4 = candidates[2];
const encryptedVote4 = publicKey.encrypt(BigInt(vote4));

const vote5 = candidates[2];
const encryptedVote5 = publicKey.encrypt(BigInt(vote5));

const votes = [vote1, vote2, vote3, vote4, vote5];
const encryptedVotes = [encryptedVote1, encryptedVote2, encryptedVote3, encryptedVote4, encryptedVote5];

var voteSum = publicKey.multiply(encryptedVote1, BigInt(1));

let decryptedvote = undefined;
if (votes.length > 1)
{
    for (let i = 1; i < votes.length; i++) {
        const vote = votes[i];
        voteSum = publicKey.multiply(voteSum, vote);
        publicKey.addition()
        initialDecryptedVoteCount = privateKey.decrypt(voteSum);
        console.log(initialDecryptedVoteCount);
    }
}


decryptedvote = privateKey.decrypt(voteSum);
return decryptedvote;
}

async function main()
{
    const primes = [2, 3, 5];
    const decryptedvote = await test();
    const decryptedvoteAsInt = parseInt(decryptedvote);
    console.log(primeFactorization(decryptedvoteAsInt, primes))
}

main();
