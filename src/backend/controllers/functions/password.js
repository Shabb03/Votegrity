const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
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

//decrypt the given password
async function decryptPassword(password) {
    const bytes = await CryptoJS.AES.decrypt(password, secretKey);
    const decryptedPassword = await bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPassword;
}

module.exports = {
    isSecurePassword,
    hashPassword,
    decryptPassword,
};