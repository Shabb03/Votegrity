const jwt = require('jsonwebtoken');
const { Voter, Election } = require('../sequelize');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY
const adminSecretKey = process.env.ADMIN_SECRET_KEY

//Wrong jwt verification throws an error so this function prevents throwing an error while verifying whether the token is valid or not
const verifyToken = (token, key) => {
    try {
        return jwt.verify(token, key);
    } catch (error) {
        return null;
    }
};

//Get the current status of the user in the system, logged in, authenticated, is an admin
exports.getStatus = async (req, res) => {
    try {
        const tokenString = req.header('Authorization');
        if (!tokenString) {
            return res.send({ status: 'Not Logged in', loggedIn: false});
        }
        const token = tokenString.replace("Bearer ", "");

        const admin = verifyToken(token, adminSecretKey);
        if (admin) {
            const activeElection = await Election.findOne({where: {isActive: true}});
            return res.send({status: 'Admin', admin: true, election: activeElection});
        }

        const accessUser = verifyToken(token, secretKey);
        req.user = accessUser;
        const user = await Voter.findOne({ where: { email: req.user.email } });
        if (user) {
            const authenticated = user.authenticated
            return res.send({status: 'Not Authenticated', loggedIn: true, authenticated: authenticated});
        }
        return res.send({status: 'Not Logged in', loggedIn: false, wrongToken: true });
    } 
    catch (error) {
        res.status(500).send({error: 'An error has occured getting the status of the user'})
    }
}