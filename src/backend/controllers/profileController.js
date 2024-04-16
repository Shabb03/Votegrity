const jwt = require('jsonwebtoken');
const sendEmail = require('./thirdParty/email');
const { generateSixDigitCode } = require('./functions/generateCode');
const db = require('../models/index.js');

const { Web3 } = require('web3');
const web3 = new Web3(process.env.API_URL);

const contractABI = require(process.env.CONTRACT_ABI);
const contractAddress = process.env.CONTRACT_ADDRESS;

//Get the information of the user
exports.userInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);
        const sq1 = await db.SecurityQuestions.findByPk(user.securityQuestion1, { attributes: ['id', 'questions'] });
        const sq2 = await db.SecurityQuestions.findByPk(user.securityQuestion2, { attributes: ['id', 'questions'] });
        res.json({
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            specialNumber: user.specialNumber,
            citizenship: user.citizenship,
            phoneNumber: user.phoneNumber,
            securityQuestion1: sq1.questions,
            securityQuestion2: sq2.questions,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

async function changeEmail(user, newEmail) {
    const existingEmail = await db.Voter.findOne({ where: { email: newEmail } });
    if (existingEmail) {
        return null;
    }
    user.email = newEmail;
    await user.save();
    newToken = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
    return newToken;
};

async function changeNumber(user, newNumber) {
    const existingNumber = await db.Voter.findOne({ where: { phoneNumber: newNumber } });
    if (existingNumber) {
        return null;
    }
    user.phoneNumber = newNumber;
    await user.save();
    return 0
};

//Change the user's email or phone number
exports.changeUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);
        const { newEmail, newNumber } = req.body;
        var message = "";
        var newToken = null;

        if (newEmail === null && newNumber === null) {
            return res.json({ error: 'Either email or phone number must be provided.' });
        }
        if (newEmail && newEmail !== null) {
            let newToken = await changeEmail(user, newEmail);
            if (newToken === null) {
                return res.json({ error: 'Email already in use' });
            }
            message = message = "Email updated successfully. ";
        }
        if (newNumber && newNumber !== null) {
            let updatedNumber = await changeNumber(user, newNumber);
            if (updatedNumber === null) {
                return res.json({ error: 'Number already in use' });
            }
            message = message + "Number updated successfully. ";
        }
        return res.json({
            email: user.email,
            number: user.phoneNumber,
            message: message,
            token: newToken
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Get a six digit token via email for new users to verify themselves and successfully log into the system
exports.getAuthToken = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);
        const authenticatedUser = user.authenticated;
        if (authenticatedUser) {
            return res.json({ error: 'User is already authenticated', authenticated: true });
        }
        const sixDigitCode = generateSixDigitCode();
        user.authToken = sixDigitCode;
        await user.save();
        sendEmail("Authentication Code", user.email, "Here is your authentication code: " + sixDigitCode);
        res.json({ message: "Email sent" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Submit the 6 digit token received to verify the user
exports.authAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);
        const { token } = req.body;
        if (token === user.authToken) {
            user.authenticated = true;
            user.authToken = null;
            await user.save();
            const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
            await contract.methods.registerVoter({ gasLimit: 2000000 }).send({ from: `${user.walletAddress}` })
                .on('receipt', receipt => {
                    console.log(receipt);
                })
                .on('error', error => {
                    console.error(error);
                });

            return res.json({ message: 'New user successfully authenticated' });
        }
        else {
            return res.json({ error: 'Invalid token', invalid: true });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}