const crypto = require('crypto');

//Generate a six digit code
function generateSixDigitCode() {
    const randomSixDigitNumber = crypto.randomInt(100000, 1000000);
    return randomSixDigitNumber.toString();
}

function generatePublishKey() {
    const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!$&';
    let randomString = '';
    const length = 10;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
        randomString += allowedCharacters[randomIndex];
    }
    return randomString;
}

module.exports = {
    generateSixDigitCode,
    generatePublishKey,
};