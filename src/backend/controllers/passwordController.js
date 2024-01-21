const crypto = require('crypto');
const generateSixDigitCode = require('./functions/generateCode');
const { isSecurePassword, hashPassword } = require('./functions/password');
const { Voter } = require('../sequelize');

exports.authCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const sixDigitCode = generateSixDigitCode();
        user.resetToken = sixDigitCode;
        await user.save();
        res.json({resetToken: sixDigitCode});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.resetPassword = async (req, res) => {
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
            return res.status(401).json({ message: 'Invalid resetToken' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);

        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            res.send({message: 'Password is not strong enough'});
        }
        const hashedPassword = hashPassword(password);
        user.password = hashedPassword;
        await user.save();
        res.send({message: 'User password updated successfully'});
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}