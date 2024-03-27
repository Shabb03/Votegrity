const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const { privateDecrypt } = require('crypto');
require('dotenv').config();

const saltRounds = parseInt(process.env.SALTROUNDS);
const secretKey = process.env.DECRYPT_PASSWORD_KEY;

//check if the password meets the security requirements
async function isSecurePassword(password) {
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    const hasMinLength = password.length >= 10;
    return hasNumber && hasLowercase && hasUppercase && hasSpecialChar && hasMinLength;
}

//hash the password
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

//decrypt the given password using the private key provided
async function decryptPassword(privateKey, encryptedPassword) {
    const encryptedData = Buffer.from(encryptedPassword)
    const decryptedData = privateDecrypt(
        privateKey,
        encryptedData
    );
    return decryptedData.toString('utf-8');
}

module.exports = {
    isSecurePassword,
    hashPassword,
    decryptPassword,
};