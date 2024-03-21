const { isSecurePassword, hashPassword, decryptPassword } = require('./functions/password');
const { SecurityQuestions, Voter } = require('../sequelize');  
const countryData = require('../assets/citizenship.json');

//Get all possible security questions
exports.securityQuestions = async (req, res) => {
    try {
        const allSecurityQuestions = await SecurityQuestions.findAll({
            attributes: ['questions']
        });
        const questions = allSecurityQuestions.map(question => question.questions);
        res.json({ questions });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Register a new user
exports.signup = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, specialNumber, citizenship, phoneNumber, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;
        if (!name || !email || !password || !dateOfBirth || !specialNumber || !citizenship || !phoneNumber || !securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
            return res.json({error: 'All required inputs not provided'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({error: 'Invalid Email'});
        }
        const existingUser = await Voter.findOne({ where: { email } });
        if (existingUser) {
            return res.json({ error: 'User with email already exists' });
        }
        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            return res.json({error: 'Password is not strong enough' });
        }
        if (!countryData.includes(citizenship)) {
            return res.json({error: 'Incorrect citizenship provided'});
        }

        const sq1 = await SecurityQuestions.findOne({where: { questions: securityQuestion1 }, attributes: ['id'],});
        const sq2 = await SecurityQuestions.findOne({where: { questions: securityQuestion2 }, attributes: ['id'],});
        if (!sq1 || !sq2) {
            res.json({ message: 'Security question not found' });
        }

        //const decryptedPassword = await decryptPassword(password);
        //const hashedPassword = await hashPassword(decryptedPassword);

        const hashedPassword = await hashPassword(password);

        const newUser = await Voter.create({
            name: name,
            email: email,
            password: hashedPassword,
            dateOfBirth: dateOfBirth,
            specialNumber: specialNumber,
            citizenship: citizenship,
            phoneNumber: phoneNumber,
            securityQuestion1: sq1.id, 
            securityAnswer1: securityAnswer1, 
            securityQuestion2: sq2.id, 
            securityAnswer2: securityAnswer2,
        });

        const userResponse = {
            name: newUser.name,
            email: newUser.email,
        };
        res.status(201).json({ user: userResponse, message: 'User created successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
