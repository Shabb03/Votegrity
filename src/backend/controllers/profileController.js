const { Voter } = require('../sequelize');
const jwt = require('jsonwebtoken');

exports.userInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            name: user.username,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            specialNumber: user.specialNumber,
            citizenship: user.citizenship,
            phoneNumber: user.phoneNumber
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.changeUserEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newEmail = req.body.email;
        const existingEmail = await Voter.findOne({ where: { email: newEmail } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = newEmail;
        await user.save();
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
        res.send({
            email: user.email,
            token: token,
            message: 'Email updated successfully' 
        })
    } 
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.changeUserNumber = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Voter.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newNumber = req.body.phoneNumber;
        const existingNumber = await Voter.findOne({ where: { phoneNumber: newNumber } });
        if (existingNumber) {
            return res.status(400).json({ message: 'Number already in use' });
        }
        user.phoneNumber = newNumber;
        await user.save();
        res.send({
            phoneNumber: user.phoneNumber,
            message: 'Number updated successfully' 
        })
    } 
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};