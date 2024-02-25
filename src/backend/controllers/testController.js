const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { Voter } = require('../sequelize');

const secretKey = 'sharedSecretKey';

exports.test = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({ error: 'All required inputs not provided' });
        }
        const user = await Voter.findOne({where: {email: email}});
        if (!user) {
            return res.json({error: 'Account with this email not found'});
        }


        const bytes = CryptoJS.AES.decrypt(password, secretKey);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        console.log(decryptedPassword);


        /*
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({error: 'Password is incorrect'});
        }
        */

        
        return res.send({
            email: user.email,
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({error: 'An error has occured'});
    }
}