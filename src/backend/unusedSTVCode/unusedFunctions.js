//single-transferrable voting process {{unused}}
if (false) { }
else if (electionType === processes[2]) {
    const { ranks } = req.body;
    const checkRank = await checkRanks(ranks);
    if (checkRank !== null) {
        return res.json({ error: checkRank });
    }
    const { blindedSignature, encryptedVote } = await vote3(ranks, adminPrivateKey, adminPublicKey);
    const submitted = await solContract(userId, electionId, encryptedVote, blindedSignature);
    if (!submitted) {
        return res.json({ error: 'Ballot already cast' });
    }
    return res.json({ message: 'Vote submitted successfully' });
}

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