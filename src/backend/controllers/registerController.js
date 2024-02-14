const { isSecurePassword, hashPassword } = require('./functions/password');
const db = require('../models/index.js');
const paillier = require('paillier-bigint');

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
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Register a new user
exports.signup = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, specialNumber, citizenship, phoneNumber, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;
        if (!name || !email || !password || !dateOfBirth || !specialNumber || !citizenship || !phoneNumber || !securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
            return res.json({error: 'All required inputs not provided'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({error: 'Invalid Email'});
        }
        const existingUser = await db.Voter.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists, email in use' });
        }

        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            return res.json({error: 'Password is not strong enough' });
        }

        const sq1 = await db.SecurityQuestions.findOne({
            where: { questions: securityQuestion1 },
            attributes: ['id'],
        });
        const sq2 = await db.SecurityQuestions.findOne({
            where: { questions: securityQuestion2 },
            attributes: ['id'],
        });

        if (!sq1 || !sq2) {
            res.status(404).json({ message: 'Security question not found' });
        }

        const hashedPassword = await hashPassword(password);
        const ethereumWallet = generateUserEthereumWallet();

        console.log(ethereumWallet.address);
        console.log(ethereumWallet.privateKey);

        const newUser = await db.Voter.create({
            name: name,
            email: email,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
            specialNumber: specialNumber,
            citizenship: citizenship,
            phoneNumber: phoneNumber,
            walletPrivateKey: ethereumWallet.privateKey,
            walletAddress: ethereumWallet.address,
            securityQuestion1: sq1.id, 
            securityAnswer1: securityAnswer1, 
            securityQuestion2: sq2.id, 
            securityAnswer2: securityAnswer2,
        });

        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            publicKey: newUser.publicKey,
            privateKey: newUser.privateKey,
        };
        res.status(201).json({ user: userResponse, message: 'User created successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

    function generateUserEthereumWallet()
    {
        const privateKey = ethereumWallet.generate().getPrivateKey();
        const wallet = ethereumWallet.fromPrivateKey(privateKey);
        const address = '0x${wallet.getAddress().toString("hex")}';

        return {
            privateKey: privateKey.toString('hex'),
            address: address
        };
    }
};
