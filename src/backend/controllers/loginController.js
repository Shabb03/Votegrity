const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { decryptPassword } = require('./functions/password');
const { Admin, Voter } = require('../sequelize');

//Generate a login authentication token for the user with the correct login credentials
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({ error: 'All required inputs not provided' });
        }
        const user = await Voter.findOne({where: {email: email}});
        if (!user) {
            return res.json({error: 'Account with this email not found'});
        }

        /*
        const decryptedPassword = await decryptPassword(password);
        const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);
        */
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({error: 'Password is incorrect'});
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
        return res.send({
            email: user.email,
            token: token,
            authenticated: user.authenticated
        })
    } 
    catch (error) {
        res.status(500).send({error: 'An error has occured trying to log in'})
    }
}

//Generate a login authentication token for the admin with the correct login credentials
exports.adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({ error: 'All required inputs not provided' });
        }
        const user = await Admin.findOne({where: {email: email}});
        if (!user) {
            return res.json({error: 'Admin with this email not found'});
        }

        /*
        const decryptedPassword = await decryptPassword(password);
        const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);
        */
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({error: 'Password is incorrect'});
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.ADMIN_SECRET_KEY);
        return res.send({
            email: user.email,
            token: token
        })
    } 
    catch (error) {
        res.status(500).send({error: 'An error has occured trying to log in'})
    }
}