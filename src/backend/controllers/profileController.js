const jwt = require('jsonwebtoken');
const sendEmail = require('./thirdParty/email');
const generateSixDigitCode = require('./functions/generateCode');
const { Voter, SecurityQuestions } = require('../sequelize');

//Get the information of the user
exports.userInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        const sq1 = await SecurityQuestions.findByPk(user.securityQuestion1, { attributes: ['id', 'questions'] });
        const sq2 = await SecurityQuestions.findByPk(user.securityQuestion2, { attributes: ['id', 'questions'] });
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

//Change the user's email or phone number
exports.changeUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        const { newEmail, newNumber } = req.body;
        var message = "";
        var newToken = null;

        if (newEmail && newEmail !== null && newNumber && newNumber !== null) {
            const existingEmail = await Voter.findOne({ where: { email: newEmail } });
            if (existingEmail && existingNumber) {
                return res.json({ error: 'Number and email already in use' });   
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
                return res.json({ error: 'Email already in use' });
            }
            user.email = newEmail;
            await user.save();
            message = "Email updated successfully";
            newToken = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
        }
        else if (newNumber && newNumber !== null) {
            const existingNumber = await Voter.findOne({ where: { phoneNumber: newNumber } });
            if (existingNumber) {
                return res.json({ error: 'Number already in use' });
            }
            user.phoneNumber = newNumber;
            await user.save();
            message = "Number updated successfully";
        }
        else {
            return res.json({ error: 'Either email or phone number must be provided.' });
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
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Submit the 6 digit token received to verify the user
exports.authAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        const { token } = req.body;
        if (token === user.authToken) {
            user.authenticated = true;
            user.authToken = null;
            await user.save();
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