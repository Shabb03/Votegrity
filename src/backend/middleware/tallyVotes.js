const db = require("../models/index.js");
const paillier = require("paillier-bigint");

async function TallyVotesForMajority(electionId, adminPublicKey)
{
    const Candidates = db.Candidate.findAll({
        where: {
            electionId: electionId
        }
    });

    const Votes = db.Vote.findAll({
        where: {
            electionId: electionId
        }
    });

    const voteSum = 0;
    const candidateIds = [];
    const exponentsByCandidate = {}

    Votes.forEach(vote => {
        PublicKey.addition(voteSum, vote)
    });

    Candidates.foreach(candidate)
    {
        candidateIds.push(candidate.id);
        exponentsByCandidate[candidate.id] = candidate.PrimeNumber;
    }

// Initialize an object to store the encrypted total votes for each candidate
const encryptedVotesByCandidate = {};

// Iterate over each candidate and their associated exponent
for (const [candidateId, exponent] of Object.entries(exponentsByCandidate)) {
    // Homomorphically raise the total encrypted sum to the power of the exponent
    const encryptedVotes = voteSum.pow(BigInt(exponent));
    
    // Associate the encrypted votes with the candidate
    encryptedVotesByCandidate[candidateId] = encryptedVotes;
}

// The encryptedVotesByCandidate object now contains the encrypted total votes for each candidate
console.log(encryptedVotesByCandidate);

return encryptedVotesByCandidate;
}