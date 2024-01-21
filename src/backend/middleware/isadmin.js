const jwt = require('jsonwebtoken');
const { Admin } = require('../sequelize');
require('dotenv').config();
const secretKey = process.env.ADMIN_SECRET_KEY

async function authenticateAdmin(req, res, next) {
    const tokenString = req.header('Authorization');
    if (!tokenString) {
        return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }
    const token = tokenString.replace("Bearer ", "");

    try {
        const acessAdmin = jwt.verify(token, secretKey);
        req.user = acessAdmin;
        const userId = req.user.id;
        const user = await Admin.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } 
    catch (err) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports = authenticateAdmin;