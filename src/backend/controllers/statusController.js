const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const passport = require('passport');
const { Admin, Voter, Election } = require('../sequelize');

//Get the current status of the user in the system, logged in, authenticated, is an admin
exports.getStatus = async (req, res) => {
    try {
        const tokenString = req.header('Authorization');
        if (!tokenString) {
            return res.send({ status: 'Not Logged in', loggedIn: false});
        }
        const token = tokenString.replace("Bearer ", "");
        const acessUser = jwt.verify(token, secretKey);
        req.user = acessUser;
        const userId = req.user.id;
        const admin = await Admin.findByPk(userId);
        if (admin) {
            const activeElection = await Election.findOne({where: {isActive: true}});
            return res.send({status: 'Admin', admin: true, election: activeElection});
        }
        const user = await Voter.findByPk(userId);
        if (user) {
            const authenticated = user.authenticated
            return res.send({status: 'Not Authenticated', loggedIn: true, authenticated: authenticated});
        }
        else {
            return res.send({status: 'Not Logged in', loggedIn: false, wrongToken: true });
        }
    } 
    catch (error) {
        res.status(500).send({error: 'An error has occured trying to log in'})
    }
}