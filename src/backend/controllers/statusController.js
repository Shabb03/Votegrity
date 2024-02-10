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
        if (!tokenString || tokenString === "") {
            return res.send({ status: 'Not Logged in', loggedOut: true});
        }
        const token = tokenString.replace("Bearer ", "");

        const admin = verifyToken(token, adminSecretKey);
        if (admin) {
            let electionValue = false;
            const activeElection = await Election.findOne({where: {isActive: true}});
            if (activeElection); {
                electionValue = true;
            }
            console.log(electionValue);
            return res.send({status: 'Admin', admin: true, election: electionValue});
        }

        const accessUser = verifyToken(token, secretKey);
        if (accessUser) {
            req.user = accessUser;
            const user = await Voter.findOne({ where: { email: req.user.email } });
            if (user) {
                const authenticated = user.authenticated
                return res.send({status: 'Not Authenticated', loggedIn: true, authenticated: authenticated});
            }
        }
        return res.send({status: 'Not Logged in', loggedOut: true, wrongToken: true });
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({error: 'An error has occured getting the status of the user'})
    }
}