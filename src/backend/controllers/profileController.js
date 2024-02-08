const jwt = require('jsonwebtoken');
//const crypto = require('crypto');
const sendEmail = require('./thirdParty/email');
const generateSixDigitCode = require('./functions/generateCode');
const { Voter } = require('../sequelize');

//Get the information of the user
exports.userInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        res.json({
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            specialNumber: user.specialNumber,
            citizenship: user.citizenship,
            phoneNumber: user.phoneNumber,
            securityQuestion1: user.securityQuestion1,
            securityQuestion2: user.securityQuestion2,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Change the user's email or phone number
exports.changeUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const { newEmail, newNumber } = req.body;
        var message = "";
        var newToken = null;

        if (newEmail && newNumber && newEmail !== null && newNumber !== null) {
            const existingEmail = await Voter.findOne({ where: { email: newEmail } });
            if (existingEmail && existingNumber) {
                return res.status(400).json({ message: 'Number and email already in use' });   
            }
            user.email = newEmail;
            user.phoneNumber = newNumber;
            await user.save();
            message = "Email and Number updated successfully";
            newToken = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
        }
        else if (newEmail && newEmail !== null) {
            const existingEmail = await Voter.findOne({ where: { email: newEmail } });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = newEmail;
            await user.save();
            message = "Email updated successfully";
            newToken = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
        }
        else if (newNumber && newNumber !== null) {
            const existingNumber = await Voter.findOne({ where: { phoneNumber: newNumber } });
            if (existingNumber) {
                return res.status(400).json({ message: 'Number already in use' });
            }
            user.phoneNumber = newNumber;
            await user.save();
            message = "Number updated successfully";
        }
        else {
            return res.status(400).json({ error: 'Either email or phone must be provided.' });
        }        
        return res.json({ 
            email: user.email, 
            number: user.phoneNumber, 
            message: message, 
            token: newToken 
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//Get a six digit token via email for new users to verify themselves and successfully log into the system
exports.getAuthToken = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const authenticatedUser = user.authenticated;
        if (authenticatedUser) {
            return res.json({error: 'User is already authenticated', authenticated: true});
        }
        const sixDigitCode = generateSixDigitCode();
        user.authToken = sixDigitCode;
        await user.save();

        sendEmail("Authentication Code", user.email, "Here is your authentication code: " + sixDigitCode);
        res.json({message: "Email sent"});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Submit the 6 digit token received to verify the user
exports.authAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const authToken = req.body.authToken;
        if (authToken === user.authToken) {
            user.authenticated = true;
            user.authToken = null;
            await user.save();
            return res.status(200).json({ message: 'New user successfully authenticated' });
        } 
        else {
            return res.status(401).json({ message: 'Invalid authToken', invalid: true });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}