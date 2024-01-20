const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY

// Middleware to authenticate the user using a JWT token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;