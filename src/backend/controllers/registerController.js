const { isSecurePassword, hashPassword, decryptPassword } = require('./functions/password');
//const { encryptKey } = require('./functions/encryptKeys')
const db = require('../models/index.js');
const countryData = require('../assets/citizenship.json');
const { Wallet } = require('ethers');

//Get all possible security questions
exports.securityQuestions = async (req, res) => {
    try {
        const allSecurityQuestions = await db.SecurityQuestions.findAll({
            attributes: ['questions']
        });
        const questions = allSecurityQuestions.map(question => question.questions);
        res.json({ questions });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Register a new user
exports.signup = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, specialNumber, citizenship, phoneNumber, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;
        if (!name || !email || !password || !dateOfBirth || !specialNumber || !citizenship || !phoneNumber || !securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
            return res.json({ error: 'All required inputs not provided' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ error: 'Invalid Email' });
        }
        const existingUser = await db.Voter.findOne({ where: { email } });
        if (existingUser) {
            return res.json({ error: 'User with email already exists' });
        }
        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            return res.json({ error: 'Password is not strong enough' });
        }
        if (!countryData.includes(citizenship)) {
            return res.json({ error: 'Incorrect citizenship provided' });
        }

        const sq1 = await db.SecurityQuestions.findOne({ where: { questions: securityQuestion1 }, attributes: ['id'], });
        const sq2 = await db.SecurityQuestions.findOne({ where: { questions: securityQuestion2 }, attributes: ['id'], });
        if (!sq1 || !sq2) {
            res.json({ message: 'Security question not found' });
        }

        const ethereumWallet = generateUserEthereumWallet();

        const decryptedPassword = await decryptPassword(password);
        const hashedPassword = await hashPassword(decryptedPassword);
        const newUser = await db.Voter.create({
            name: name,
            email: email,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
            specialNumber: specialNumber,
            citizenship: citizenship,
            phoneNumber: phoneNumber,
            walletAddress: ethereumWallet.address,
            securityQuestion1: sq1.id,
            securityAnswer1: securityAnswer1,
            securityQuestion2: sq2.id,
            securityAnswer2: securityAnswer2,
        });

        const userResponse = {
            name: newUser.name,
            email: newUser.email,
        };
        res.json({ user: userResponse, message: 'User created successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    function generateUserEthereumWallet() {
        const wallet = Wallet.createRandom();
        return {
            privateKey: wallet.privateKey,
            address: wallet.address
        };
    };
};
