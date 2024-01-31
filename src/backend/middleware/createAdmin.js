const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const readline = require('readline');
const { isSecurePassword, hashPassword } = require('../controllers/functions/password');
const { sequelize, Admin } = require('../sequelize');  

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Create an admin via terminal command line interface
async function createAdmin() {
    try {
        const email = await askQuestion('Enter admin email: ');
        const password = await askQuestion('Enter admin password: ');

        const existingUser = await Admin.findOne({ where: { email: email } });
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
        const admin = await Admin.create({
            email: email,
            password: hashedPassword
        });
        console.log('\n\nAdmin created successfully\n');
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