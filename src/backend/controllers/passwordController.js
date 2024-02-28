const sendEmail = require('./thirdParty/email');
const generateSixDigitCode = require('./functions/generateCode');
const { isSecurePassword, hashPassword, decryptPassword } = require('./functions/password');
const { Voter, SecurityQuestions } = require('../sequelize');

//Send a six digit code via email if the user has forgotten their password
exports.authCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ error: 'Email is required' });
        }
        const user = await Voter.findOne({ where: { email } });
        if (!user) {
            return res.json({ error: 'User not found for the provided email' });
        }

        const sq1 = await SecurityQuestions.findByPk(user.securityQuestion1, { attributes: ['id', 'questions'] });
        const sq2 = await SecurityQuestions.findByPk(user.securityQuestion2, { attributes: ['id', 'questions'] });

        const sixDigitCode = generateSixDigitCode();
        user.resetToken = sixDigitCode;
        await user.save();

        sendEmail("Reset Password Code", email, "Here is your password code: " + sixDigitCode);
        res.json({message: "Email sent", securityQuestion1: sq1.questions, securityQuestion2: sq2.questions});
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
            return res.json({ error: 'All required inputs not provided' });
        }
        const user = await Voter.findOne({ where: { email } });
        if (!user) {
            return res.json({ error: 'User not found for the provided email' });
        }

        if (resetToken === user.resetToken && securityAnswer1 === user.securityAnswer1 && securityAnswer2 === user.securityAnswer2) {
            const isSecure = isSecurePassword(password);
            if (!isSecure) {
                return res.json({error: 'Password is not strong enough'});
            }
            const decryptedPassword = await decryptPassword(password);
            const hashedPassword = await hashPassword(decryptedPassword);
            user.password = hashedPassword;
            user.resetToken = null;
            await user.save();
            res.json({message: 'User password updated successfully'});
        } 
        else {
            return res.json({ error: 'Invalid resetToken', invalid: true });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}