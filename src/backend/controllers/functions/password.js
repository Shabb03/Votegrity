const bcrypt = require('bcrypt');

const saltRounds = 10;

function isSecurePassword(password) {
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    return hasNumber && hasLowercase && hasUppercase && hasSpecialChar;
}

async function hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

module.exports = {
    isSecurePassword,
    hashPassword,
};
