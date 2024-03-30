const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { decryptPassword } = require('./functions/password');
const db = require('../models/index.js');

//Generate a login authentication token for the admin or user with the correct login credentials
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({ error: 'All required inputs not provided' });
        }
        const decryptedPassword = await decryptPassword(password);

        const admin = await db.Admin.findOne({where: {email: email}});
        if (admin) {
            const isPasswordValid = await bcrypt.compare(decryptedPassword, admin.password);
            //const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.json({error: 'Password is incorrect'});
            }
            const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.ADMIN_SECRET_KEY);
            return res.json({
                email: admin.email,
                token: token,
                admin: true,
            })
        }
        const user = await db.Voter.findOne({where: {email: email}});
        if (user) {
            const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);
            //const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.json({error: 'Password is incorrect'});
            }
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY);
            return res.json({
                email: user.email,
                token: token,
                authenticated: user.authenticated,
                admin: false,
            })
        }
        return res.json({error: 'Account with this email not found'});
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({error: 'An error has occured trying to log in'})
    }
}