const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Voter } = require('../sequelize');

exports.login = async (req, res) => {
    console.log("HERE!!\n\n");
    try {
        const {email, password} = req.body
        const user = await Voter.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(403).send({
                error: 'The login information was incorrect'
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).send({
                error: 'The login information was incorrect'
            })
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY); // Replace with your secret key
        res.send({
            email: user.email,
            token: token
        })
    } 
    catch (error) {
        res.status(500).send({
            error: 'An error has occured trying to log in'
        })
    }
}