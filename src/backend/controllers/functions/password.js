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
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

module.exports = {
    isSecurePassword,
    hashPassword,
};
