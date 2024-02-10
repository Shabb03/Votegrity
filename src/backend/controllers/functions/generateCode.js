const crypto = require('crypto');

//Generate a six digit code
function generateSixDigitCode() {
    const randomSixDigitNumber = crypto.randomInt(100000, 1000000);
    return randomSixDigitNumber.toString();
}

module.exports = generateSixDigitCode;