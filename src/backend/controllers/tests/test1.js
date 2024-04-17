//gpt
function calculateTopWinners(preferences, totalSeats) {
    const tally = {};
    const winners = [];
    const totalVotes = preferences.length;
    const quota = totalVotes / (totalSeats + 1) + 1;

    for (const ballot of preferences) {
        for (const candidateId in ballot) {
            tally[candidateId] = tally[candidateId] || 0;
        }
    }
    console.log("\n\ntally", tally);

    let remainingSeats = totalSeats;
    console.log("\n\nremaining seats", remainingSeats);
    while (remainingSeats > 0) {
        const currentQuota = totalVotes / (remainingSeats + 1) + 1;
        const eliminatedCandidates = [];

        for (const ballot of preferences) {
            const firstChoice = Object.keys(ballot).find(candidateId => !eliminatedCandidates.includes(candidateId));
            if (firstChoice) {
                tally[firstChoice]++;
                if (tally[firstChoice] >= currentQuota) {
                    winners.push(firstChoice);
                    remainingSeats--;
                    if (remainingSeats === 0) {
                        break;
                    }
                    const surplusVotes = tally[firstChoice] - currentQuota;
                    if (surplusVotes > 0) {
                        redistributeSurplusVotes(ballot, surplusVotes, tally);
                    }
                    eliminatedCandidates.push(firstChoice);
                }
            }
        }

        if (winners.length === 0) {
            const lowestTallyCandidate = Object.keys(tally).reduce((a, b) => tally[a] < tally[b] ? a : b);
            eliminatedCandidates.push(lowestTallyCandidate);
        }

        for (const candidateId of eliminatedCandidates) {
            delete tally[candidateId];
        }

        if (Object.keys(tally).length === 0) {
            break;
        }
    }

    return winners;
}

function redistributeSurplusVotes(ballot, surplusVotes, tally) {
    const sortedPreferences = Object.entries(ballot).sort((a, b) => a[1] - b[1]);
    let remainingSurplusVotes = surplusVotes;
    for (const [candidateId, preference] of sortedPreferences) {
        const votes = ballot[candidateId];
        const redistributedVotes = Math.min(votes, surplusVotes);
        tally[candidateId] += redistributedVotes;
        remainingSurplusVotes -= redistributedVotes;
        if (remainingSurplusVotes === 0) {
            break;
        }
    }
}

const preferences = [
    { 2: 1, 3: 2, 5: 3 },
    { 2: 1, 3: 3, 5: 2 },
    { 2: 1, 3: 2, 5: 3 },
];

const totalSeats = 2; // Number of seats to be filled
const winners = calculateTopWinners(preferences, totalSeats);
console.log("Top winners:", winners);