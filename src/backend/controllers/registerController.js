const bcrypt = require('bcrypt');
const { Voter } = require('../sequelize');

const saltRounds = 10;

function isSecurePassword(password) {
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    return hasNumber && hasLowercase && hasUppercase && hasSpecialChar;
}
  

exports.signup = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, specialNumber, citizenship, phoneNumber, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;
        const existingUser = await Voter.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            res.send({message: 'Password is not strong enough'});
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