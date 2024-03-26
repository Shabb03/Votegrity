const jwt = require('jsonwebtoken');
const db = require('../models/index.js');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY

//Check if the user is logged into the system using jwt authentication token
async function authenticateToken(req, res, next) {
    const tokenString = req.header('Authorization');
    if (!tokenString) {
        return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }
    const token = tokenString.replace("Bearer ", "");
    try {
        const acessUser = jwt.verify(token, secretKey);
        req.user = acessUser;
        const userId = req.user.id;
        const user = await db.Voter.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } 
    catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Access denied. Token not provided.' });
    }
}

module.exports = authenticateToken;