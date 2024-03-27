const { generateKeyPairSync } = require('crypto');
const { Admin, Voter, Election } = require('../../sequelize');

//generate a private and public key pair
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

//generate a private and public key pair for admin
async function generateAdminKeys(id) {
    const admin = await Admin.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    admin.privateKey = privateKey;
    admin.publicKey = publicKey;
    await user.save();
}

//generate a private and public key pair for user
async function generateUserKeys(id) {
    const user = await Voter.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    user.privateKey = privateKey;
    user.publicKey = publicKey;
    await user.save();
}

//generate a private and public key pair for an election
async function generateElectionKeys(id) {
    const election = await Election.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    election.privateKey = privateKey;
    election.publicKey = publicKey;
    await election.save();
}

module.exports = {
    generateKeys,
    generateAdminKeys,
    generateUserKeys,
    generateElectionKeys,
};