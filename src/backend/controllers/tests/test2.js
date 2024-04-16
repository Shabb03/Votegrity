//co-pilot
function calculateWinners(preferences) {
    const voteCounts = new Map();
    preferences.forEach((preferenceObj) => {
        Object.entries(preferenceObj).forEach(([candidateId, preference]) => {
            voteCounts.set(candidateId, (voteCounts.get(candidateId) || 0) + preference);
        });
    });
    console.log("voteCounts", voteCounts);

    const numSeats = 2;
    const totalValidVotes = preferences.length;
    const quota = Math.round(totalValidVotes / (numSeats + 1) + 1);

    console.log("totalValidVotes, quota", totalValidVotes, quota);

    // Eliminate candidates with fewer votes than the quota
    const eliminatedCandidates = [];
    for (const [candidateId, votes] of voteCounts) {
        console.log("for", candidateId, votes);
        if (votes < quota) {
            eliminatedCandidates.push(candidateId);
            voteCounts.delete(candidateId);
        }
    }

    console.log("eliminatedCandidates", eliminatedCandidates);

    for (const [candidateId, votes] of voteCounts) {
        if (votes > quota) {
            const surplus = votes - quota;
            voteCounts.set(candidateId, quota);
            preferences.forEach((preferenceObj) => {
                eliminatedCandidates.forEach((eliminatedId) => {
                    const nextPreference = preferenceObj[eliminatedId];
                    if (nextPreference) {
                        voteCounts.set(nextPreference, (voteCounts.get(nextPreference) || 0) + surplus);
                    }
                });
            });
        }
    }

    const sortedCandidates = [...voteCounts.entries()].sort((a, b) => b[1] - a[1]);
    const topWinners = sortedCandidates.slice(0, 2).map(([candidateId]) => candidateId);
    return topWinners;
}

const preferences = [
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 3, 5: 2 },
    { 2: 1, 3: 2, 5: 3 },
];

const top2Winners = calculateWinners(preferences);
console.log("Top 2 winners:", top2Winners);