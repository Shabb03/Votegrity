const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const db = require('../models/index.js');
const { hashPassword } = require('./functions/password');
const { generateKeyPairSync, privateDecrypt } = require('crypto');

exports.gettest = async (req, res) => {
    try {
        const password = 'SecurePassword1!';
        const saltRounds = 10;
        //const hashedPassword = await hashPassword(password, saltRounds);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({error: 'An error has occured', message: error});
    }
}

exports.posttest = async (req, res) => {
    try {
        const user = await Voter.findByPk(1);
        const privateKey = user.privateKey;

        const { encryptedPassword } = req.body;
        const encryptedData = Buffer.from(encryptedPassword)
        console.log("encryptedData", encryptedData);
        const decryptedData = privateDecrypt(
            privateKey,
            encryptedData
        );
        console.log("DECRYPTED DATA", decryptedData.toString('utf-8'));
        return res.json({message: decryptedData.toString('utf-8')})
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({error: 'An error has occured', message: error});
    }
}