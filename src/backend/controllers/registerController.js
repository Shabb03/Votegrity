const { isSecurePassword, hashPassword } = require('./functions/password');
const { Voter } = require('../sequelize');  

exports.signup = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, specialNumber, citizenship, phoneNumber, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;
        const existingUser = await Voter.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            return res.send({message: 'Password is not strong enough'});
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await Voter.create({
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
            specialNumber,
            citizenship,
            phoneNumber,
            securityQuestion1, 
            securityAnswer1, 
            securityQuestion2, 
            securityAnswer2
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