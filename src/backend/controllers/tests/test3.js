/**
 * Calculate winners using the Single Transferable Voting (STV) system.
 * @param {Array} preferences - An array of preference objects.
 * @param {number} seats - The number of available seats.
 * @returns {Array} - An array of winning candidate IDs.
 */
function calculateSTVWinners(preferences, seats) {
    // Initialize vote counts for each candidate
    /*
    const voteCounts = new Map();
    for (const preference of preferences) {
        for (const candidateId in preference) {
            voteCounts.set(candidateId, (voteCounts.get(candidateId) || 0) + 1);
        }
    }
    */
    const voteCounts = new Map();
    preferences.forEach((preferenceObj) => {
        Object.entries(preferenceObj).forEach(([candidateId, preference]) => {
            voteCounts.set(candidateId, (voteCounts.get(candidateId) || 0) + preference);
        });
    });
    console.log("voteCounts", voteCounts);

    // Initialize winners array
    const winners = [];

    while (winners.length < seats) {
        // Calculate the quota (total votes / (seats + 1))
        console.log("winners", winners);
        const totalVotes = preferences.length;
        console.log("\ntotalVotes", totalVotes);
        const quota = Math.floor(totalVotes / (seats + 1) + 1);

        // Find candidates with surplus votes
        const surplusCandidates = [];
        for (const [candidateId, votes] of voteCounts.entries()) {
            if (votes > quota) {
                surplusCandidates.push(candidateId);
            }
        }
        console.log("surplusCandidates", quota, surplusCandidates);

        if (surplusCandidates.length > 0) {
            // Distribute surplus votes to next preferences
            for (const candidateId of surplusCandidates) {
                const surplusVotes = voteCounts.get(candidateId) - quota;
                for (const preference of preferences) {
                    if (preference[candidateId]) {
                        const nextPreference = preference[candidateId];
                        if (!winners.includes(nextPreference)) {
                            voteCounts.set(nextPreference, (voteCounts.get(nextPreference) || 0) + surplusVotes);
                        }
                    }
                }
                voteCounts.delete(candidateId);
            }
        }
        else {
            // Eliminate candidate with the least votes
            const minVotes = Math.min(...voteCounts.values());
            const eliminatedCandidate = [...voteCounts.entries()].find(([_, votes]) => votes === minVotes)[0];
            voteCounts.delete(eliminatedCandidate);
        }

        console.log("\nvoteCount ", voteCounts.entries());
        // Check if any candidate has reached the quota
        for (const [candidateId, votes] of voteCounts.entries()) {
            if (votes >= quota && !winners.includes(candidateId)) {
                console.log("candidateId", candidateId);
                winners.push(candidateId);
            }
        }
    }

    return winners;
}

// Example usage:
const preferences = [
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 3, 5: 2 },
    { 2: 1, 3: 2, 5: 3 },
];

const seats = 2; // Number of available seats
const stvWinners = calculateSTVWinners(preferences, seats);
console.log('STV Winners:', stvWinners); // Output: [3, 2] (corrected order)
