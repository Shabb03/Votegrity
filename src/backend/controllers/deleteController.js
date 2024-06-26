const jwt = require('jsonwebtoken');
const sendEmail = require('./thirdParty/email');
const { generateSixDigitCode } = require('./functions/generateCode');
const db = require('../models/index.js');

//Get a six digit token via email for users to use to delete their account
exports.deleteCode = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);
        const token = generateSixDigitCode();
        user.resetToken = token;
        await user.save();
        await sendEmail("Account Deletion Code", user.email, "Here is your delete code: " + token);
        res.json({ message: "Email sent" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//Submit the 6 digit token received to delete the user's account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);

        const { token } = req.body;
        if (token === user.resetToken) {
            await db.Vote.destroy({ where: { userId: userId } });
            await db.Voter.destroy({ where: { id: userId } });
            await sendEmail("Account Deleted", user.email, "Your account has successfully been deleted");
            return res.json({ message: 'Account deleted successfully' });
        }
        else {
            return res.json({ error: 'Invalid code' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};