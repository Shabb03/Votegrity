const { isSecurePassword, hashPassword } = require('./functions/password');
const { SecurityQuestions, Voter } = require('../sequelize');  

//test
//Get all possible security questions
exports.securityQuestions = async (req, res) => {
    try {
        console.log("HERE 1");
        const allSecurityQuestions = await SecurityQuestions.findAll({
            attributes: ['questions']
        });
        console.log("HERE 2");
        console.log(allSecurityQuestions);
        const questions = allSecurityQuestions.map(question => question.questions);
        console.log("HERE 3");
        console.log(questions);
        res.json({ questions });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

//Register a new user
exports.signup = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, specialNumber, citizenship, phoneNumber, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;
        const existingUser = await Voter.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists, email in use' });
        }

        const isSecure = isSecurePassword(password);
        if (!isSecure) {
            return res.send({error: 'Password is not strong enough' });
        }

        const sq1 = await SecurityQuestion.findOne({
            where: { questions: securityQuestion1 },
            attributes: ['id'],
        });
        const sq2 = await SecurityQuestion.findOne({
            where: { questions: securityQuestion2 },
            attributes: ['id'],
        });

        if (!sq1 || !sq2) {
        } else {
            res.status(404).json({ message: 'Security question not found' });
        }

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
            securityAnswer: securityAnswer2
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