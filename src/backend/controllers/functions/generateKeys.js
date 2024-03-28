const { generateKeyPairSync } = require('crypto');
const db = require('../../models/index');

async function generateKeys() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
            privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return { privateKey, publicKey };
}

async function generateAdminKeys(id) {
    const admin = await db.Admin.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    admin.privateKey = privateKey;
    admin.publicKey = publicKey;
    await user.save();
}

async function generateUserKeys(id) {
    const user = await db.Voter.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    user.privateKey = privateKey;
    user.publicKey = publicKey;
    await user.save();
}

/*async function generateElectionKeys(id) {
    const election = await Election.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    election.privateKey = privateKey;
    election.publicKey = publicKey;
    await election.save();
}*/

module.exports = {
    generateKeys,
    generateAdminKeys,
    generateUserKeys,
    //generateElectionKeys,
};