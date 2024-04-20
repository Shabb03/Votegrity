//single-transferrable voting process {{unused}}
//else if (electionType === processes[2]) {
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
//}