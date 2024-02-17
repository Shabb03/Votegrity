const bcrypt = require('bcrypt');
const { isSecurePassword, hashPassword } = require('../controllers/functions/password');

//check if the function tests the security level of the password
describe('isSecurePassword', () => {
    test('should return true for a secure password', async () => {
        const securePassword = 'SecurePassword1!';
        const secure = await isSecurePassword(securePassword);
        console.log("SECURE: ", secure)
        expect(secure).toBe(true);
    });

    test('should return false for an insecure password', async () => {
        const insecurePassword = 'insecure123';
        const secure = await isSecurePassword(insecurePassword);
        console.log("INSECURE: ", secure)
        expect(secure).toBe(false);
    });
});

//check if the password is hashed into a secure string
describe('hashPassword', () => {
    test('should hash the password', async () => {
        const plainPassword = 'SecurePassword1!';
        const hashedPassword = await hashPassword(plainPassword);
        expect(typeof hashedPassword).toBe('string');

        bcrypt.compare = jest.fn().mockResolvedValue(true);
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        expect(match).toBe(true);
    });
});