const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const readline = require('readline');
const { isSecurePassword, hashPassword } = require('../controllers/functions/password');
const db = require('../models/index.js');  

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Create an admin via terminal command line interface
async function createAdmin() {
    try {
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

        // key creation for admins used for the paillier encryption and blind signature implementation
        const { blindPublicKey, blindPrivateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
            }
          });

          const paillierKeys = paillier.generateRandomKeys(2048);

        const admin = await db.Admin.create({
            email: email,
            password: hashedPassword,
            blindPublicKey: blindPublicKey,
            blindPrivateKey: blindPrivateKey,
            paillierPublicKey: paillierKeys.publicKey,
            paillierPrivateKey: paillierKeys.PrivateKey,
        });
        console.log('\n\nAdmin created successfully\n');
        console.log('\n\nThis is your blind signature private key: ${blindPrivateKey}\n')
        console.log('\n\nThis is your encryption private key: ${paillierPrivateKey}\n')
    }
    catch (error) {
        console.error('Error creating admin: ', error.message);
    }
    finally {
        rl.close();
        db.sequelize.close();
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