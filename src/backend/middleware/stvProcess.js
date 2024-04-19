function calculateWinners(obj) {
    let preferences = obj;
    const numSeats = 2;
    const totalValidVotes = preferences.length;
    const quota = Math.round(totalValidVotes / (numSeats + 1) + 1);
    const winners = [];

    const voteCounts = new Map();
    preferences.forEach((preferenceObj) => {
        Object.entries(preferenceObj).forEach(([candidateId, preference]) => {
            if (preference === 1) {
                voteCounts.set(candidateId, (voteCounts.get(candidateId) || 0) + 1);
            }
            else {
                voteCounts.set(candidateId, (voteCounts.get(candidateId) || 0));
            }
        });
    });

    while (winners.length < numSeats) {
        const sortedCandidates = [...voteCounts.entries()].sort((a, b) => b[1] - a[1]);
        const [winnerId, winnerVotes] = sortedCandidates[0] ? sortedCandidates[0] : null;
        if (winnerId.length === numSeats) {
            break;
        }

        if (winnerVotes >= quota) {
            winners.push(winnerId);
            preferences.forEach((preferenceObj) => {
                Object.entries(preferenceObj).forEach(([candidateId, preference]) => {
                    if (preference === 1 && candidateId === winnerId) {
                        const [secondPreferenceCandidateId, secondPreference] = Object.entries(preferenceObj).find(([_, secondPref]) => secondPref === 2);
                        if (secondPreferenceCandidateId) {
                            voteCounts.set(secondPreferenceCandidateId, (voteCounts.get(secondPreferenceCandidateId) || 0) + 1);
                        }
                    }
                });
            });
            voteCounts.delete(winnerId);
        }
        else {
            const [eliminatedId, eliminatedVotes] = sortedCandidates[sortedCandidates.length - 1];
            preferences.forEach((preferenceObj) => {
                Object.entries(preferenceObj).forEach(([candidateId, preference]) => {
                    if (preference === 1 && candidateId === eliminatedId) {
                        const [secondPreferenceCandidateId, secondPreference] = Object.entries(preferenceObj).find(([_, secondPref]) => secondPref === 2);
                        if (secondPreferenceCandidateId) {
                            voteCounts.set(secondPreferenceCandidateId, (voteCounts.get(secondPreferenceCandidateId) || 0) + 1);
                        }
                    }
                });
            });
            voteCounts.delete(eliminatedId);
        }
    }
    return winners;
}

/*
const preferences = [
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 3, 5: 2 },
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 3, 5: 2 },
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 3, 5: 2 },
    { 2: 1, 3: 2, 5: 3 },
    { 2: 2, 3: 1, 5: 3 },
    { 2: 2, 3: 3, 5: 1 },
    { 2: 2, 3: 1, 5: 3 },
];
*/

const preferences = [
    { 2: 2, 3: 3, 5: 1 },
    { 2: 3, 3: 2, 5: 1 },
    { 2: 2, 3: 3, 5: 1 },
    { 2: 2, 3: 3, 5: 1 },
    { 2: 3, 3: 2, 5: 1 },
    { 2: 2, 3: 3, 5: 1 },
    { 2: 2, 3: 3, 5: 1 },
    { 2: 3, 3: 2, 5: 1 },
    { 2: 2, 3: 3, 5: 1 },
    { 2: 1, 3: 3, 5: 2 },
    { 2: 3, 3: 1, 5: 2 },
    { 2: 1, 3: 3, 5: 2 },
];

const topWinners = calculateWinners(preferences);
console.log("Top winners:", topWinners);