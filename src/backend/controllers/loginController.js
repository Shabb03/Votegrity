const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Admin, Voter } = require('../sequelize');

//Generate a login authentication token for the user with the correct login credentials
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await Voter.findOne({where: {email: email}});
        if (!user) {
            return res.status(403).send({error: 'The login information was incorrect'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).send({error: 'The login information was incorrect'})
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
        return res.send({
            email: user.email,
            token: token
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
        const user = await Admin.findOne({where: {email: email}});
        if (!user) {
            return res.status(403).send({error: 'The login information was incorrect'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).send({error: 'The login information was incorrect'})
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