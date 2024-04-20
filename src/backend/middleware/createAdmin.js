const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const readline = require('readline');
const { isSecurePassword, hashPassword } = require('../controllers/functions/password');
const keyFunctions = require('../middleware/keyFunctions');
const crypto = require('crypto');
const paillier = require('paillier-bigint');
const db = require('../models/index.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Create an admin via terminal command line interface
async function createAdmin() {
    try {
        console.log("\n\n\n\n\n\n\n\n\n\n");
        const email = await askQuestion('Enter admin email: ');
        const password = await askQuestion('Enter admin password: ');

        const existingUser = await db.Admin.findOne({ where: { email: email } });
        if (existingUser) {
            console.error('User already exists');
            return;
        }
        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            console.error('Password is not strong enough');
            return;
        }
        const hashedPassword = await hashPassword(password);

        const blindKey = BlindSignature.keyGeneration({ b: 2048 });
        const keyPair = blindKey.keyPair;
        const blindPublicKey = keyPair.n.toString() + '#' + keyPair.e.toString();

        const {publicKey, privateKey} = await paillier.generateRandomKeys(2048);
        const publicKeyJson = JSON.stringify(publicKey, (_, v) => typeof v === 'bigint' ? v.toString() : v);

        const admin = await db.Admin.create({
            email: email,
            password: hashedPassword,
            blindPublicKey: blindPublicKey,
            paillierPublicKey: publicKeyJson,
        });

        const paillierPrivateKeyPath = keyFunctions.storeEncryptedAdminPaillierKeysOnS3(privateKey, admin.email);
        const blindPrivateKeyPath = keyFunctions.storeEncryptedAdminBlindKeysOnS3(blindKey, admin.email);


        admin.paillierPrivateKeyPath = paillierPrivateKeyPath;
        admin.blindPrivateKeyPath = blindPrivateKeyPath;
        await admin.save();

        console.log(`\n\nAdmin created successfully\n`);
        console.log(`\n\nThis is your blind signature private key: ${blindPrivateKey}\n`);
        console.log(`\n\nThis is your encryption private key: ${privateKey}\n`);
        console.log(`\n\nDo NOT share these credentials with anyone\n`);
    }
    catch (error) {
        console.error('Error creating admin: ', error.message);
    }
    finally {
        rl.close();
        sequelize.close();
    }
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

console.log("Wait 5 seconds\n\n");
setTimeout(() => {
    createAdmin();
}, 2000);