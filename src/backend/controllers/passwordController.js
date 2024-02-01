//const crypto = require('crypto');
const sendEmail = require('./thirdParty/email');
const generateSixDigitCode = require('./functions/generateCode');
const { isSecurePassword, hashPassword } = require('./functions/password');
const { Voter } = require('../sequelize');

//Send a six digit code via email if the user has forgotten their password
exports.authCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const sixDigitCode = generateSixDigitCode();
        user.resetToken = sixDigitCode;
        await user.save();

        sendEmail("Reset Password Code", user.email, "Here is your password code: " + sixDigitCode);
        res.json({message: "Email sent"});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Submit the 6 digit token received to verify it is the user attempting to change their password
/*exports.resetPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const answer1 = req.body.securityAnswer1;
        const answer2 = req.body.securityAnswer2;
        const resetToken = req.body.resetToken;
        if (resetToken === user.resetToken && answer1 === user.securityAnswer1 && answer2 === user.securityAnswer2) {
            user.resetToken = null;
            await user.save();
            return res.status(200).json({ message: 'Reset token accepted' });
        } 
        else {
            return res.status(401).json({ message: 'Invalid resetToken', invalid: true });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}*/

//Change the user's password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const answer1 = req.body.securityAnswer1;
        const answer2 = req.body.securityAnswer2;
        const resetToken = req.body.resetToken;
        const password = req.body.password;

        if (resetToken === user.resetToken && answer1 === user.securityAnswer1 && answer2 === user.securityAnswer2) {
            user.resetToken = null;
            await user.save();
        } 
        else {
            return res.status(401).json({ message: 'Invalid resetToken', invalid: true });
        }
        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            return res.send({error: 'Password is not strong enough'});
        }
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();
        res.send({message: 'User password updated successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}