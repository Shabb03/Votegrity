const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY

function authenticateToken(req, res, next) {
    const tokenString = req.header('Authorization');
    if (!tokenString) {
        return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }
    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;