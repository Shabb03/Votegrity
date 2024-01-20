const bcrypt = require('bcrypt');
const { Voter } = require('../sequelize');

const saltRounds = 10;

exports.signup = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, specialNumber, citizenship, phoneNumber } = req.body;
        const existingUser = await Voter.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await Voter.create({
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
            specialNumber,
            citizenship,
            phoneNumber,
            authenticated: false,
            voted: false,
        });

        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        };
        res.status(201).json({ user: userResponse, message: 'User created successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}