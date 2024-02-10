//const crypto = require('crypto');
const sendEmail = require('./thirdParty/email');
const generateSixDigitCode = require('./functions/generateCode');
const { isSecurePassword, hashPassword } = require('./functions/password');
const { Voter, SecurityQuestions } = require('../sequelize');

//Send a six digit code via email if the user has forgotten their password
exports.authCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required in the request body' });
        }
        const user = await Voter.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found for the provided email' });
        }

        const sq1 = await SecurityQuestions.findByPk(user.securityQuestion1, { attributes: ['id', 'questions'] });
        const sq2 = await SecurityQuestions.findByPk(user.securityQuestion2, { attributes: ['id', 'questions'] });

        const sixDigitCode = generateSixDigitCode();
        user.resetToken = sixDigitCode;
        await user.save();

        sendEmail("Reset Password Code", email, "Here is your password code: " + sixDigitCode);
        res.json({message: "Email sent", securityQuestion1: sq1.questions, securityQuestion2: sq2.questions});
        //res.json({code: sixDigitCode});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Change the user's password
exports.changePassword = async (req, res) => {
    try {
        const { email, resetToken, securityAnswer1, securityAnswer2, password } = req.body;
        if (!email || !resetToken || !securityAnswer1 || !securityAnswer2 || !password) {
            return res.status(400).json({ error: 'All required inputs not provided' });
        }
        const user = await Voter.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found for the provided email' });
        }

        if (resetToken === user.resetToken && securityAnswer1 === user.securityAnswer1 && securityAnswer2 === user.securityAnswer2) {
            const isSecure = isSecurePassword(password);
            if (!isSecure) {
                return res.send({error: 'Password is not strong enough'});
            }
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword;
            user.resetToken = null;
            await user.save();
            res.send({message: 'User password updated successfully'});
        } 
        else {
            return res.status(401).json({ message: 'Invalid resetToken', invalid: true });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}