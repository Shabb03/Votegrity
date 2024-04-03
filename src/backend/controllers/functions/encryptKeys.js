const CryptoJS = require('crypto-js');
require('dotenv').config();

const secretKey = process.env.ENCRYPT_KEY;

//encrypt the key using symmetric encryption
async function encryptKey(key) {
    const encryptedPassword = CryptoJS.AES.encrypt(key, secretKey).toString();
    return encryptedPassword;
}

module.exports = {
    encryptKey,
};