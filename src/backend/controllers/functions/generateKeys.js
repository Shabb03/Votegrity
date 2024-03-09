const { generateKeyPairSync } = require('crypto');
const { Admin, Voter } = require('../../sequelize');

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
    const admin = await Admin.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    admin.privateKey = privateKey;
    admin.publicKey = publicKey;
    await user.save();
}

async function generateUserKeys(id) {
    const user = await Voter.findByPk(id);
    const { privateKey, publicKey } = await generateKeys();
    user.privateKey = privateKey;
    user.publicKey = publicKey;
    await user.save();
}

module.exports = {
    generateKeys,
    generateAdminKeys,
    generateUserKeys
};