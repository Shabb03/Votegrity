const blindSignatures = require('blind-signatures');
const paillier = require('paillier-bigint');

async function blindVote(adminPublicKey, vote) {
    const parts = adminPublicKey.split('#');
    const { blinded, r } = await blindSignatures.blind({
        message: vote.toString(),
        N: parts[0].toString(),
        E: parts[1].toString(),
    });
    return { blinded, r };
};

async function signVote(adminPrivateKey, blindedVote) {
    const signedVote = await blindSignatures.sign({
        blinded: blindedVote,
        key: adminPrivateKey,
    });

    return signedVote;
}

async function unblindVote(adminPublicKey, signed, r) {
    const parts = adminPublicKey.split('#');
    const unblindedVote = await blindSignatures.unblind({
        signed: signed,
        N: parts[0].toString(),
        r: r,
    });

    return unblindedVote;
}

async function verifySignForVoter(adminPublicKey, unblindedVote, vote) {
    var verified = false;
    const parts = adminPublicKey.split('#');

    const result = await blindSignatures.verify({
        unblinded: unblindedVote,
        N: parts[0].toString(),
        E: parts[1].toString(),
        message: vote.toString(),
    });

    if (result) {
        verified = true;
    }

    return verified;
}

async function verifySignForAdmin(adminPrivateKey, unblindedVote, vote) {
    var verified = false;

    const result = await blindSignatures.verify2({
        unblinded: unblindedVote,
        key: adminPrivateKey,
        message: vote.toString(),
    });

    if (result) {
        verified = true;
    }

    return verified;
}

async function encryptVote(adminPublicKey, vote) {
    const publicKeyAsJSON = JSON.parse(adminPublicKey);
    const newPublicKey = new paillier.PublicKey(BigInt(publicKeyAsJSON.n), BigInt(publicKeyAsJSON.g));
    const encryptedVote = await newPublicKey.encrypt(vote);
    return encryptedVote.toString();
};

async function decryptVote(adminPrivateKey, encryptedVote) {
    const voteAsBigInt = BigInt(encryptedVote);
    const decryptedVote = await adminPrivateKey.decrypt(voteAsBigInt);
    return decryptedVote.toString();
};

module.exports = { blindVote, signVote, unblindVote, verifySignForVoter, verifySignForAdmin, encryptVote, decryptVote }