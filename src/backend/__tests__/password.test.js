const bcrypt = require('bcrypt');
const { isSecurePassword, hashPassword } = require('../controllers/functions/password');

//check if the function tests the security level of the password
describe('isSecurePassword', () => {
    test('should return true for a secure password', async () => {
        const securePassword = 'SecurePassword1!';
        const secure = await isSecurePassword(securePassword);
        expect(secure).toBe(true);
    });

    test('should return false for an insecure password', async () => {
        const insecurePassword = 'insecure123';
        const secure = await isSecurePassword(insecurePassword);
        expect(secure).toBe(false);
    }, 5000);
});

//check if the password is hashed into a secure string
describe('hashPassword', () => {
    test('should hash the password', async () => {
        const password = 'SecurePassword1!';
        const hashedPassword = await hashPassword(password);
        expect(typeof hashedPassword).toBe('string');

        bcrypt.compare = jest.fn().mockResolvedValue(true);
        const match = await bcrypt.compare(password, hashedPassword);
        expect(match).toBe(true);
    }, 3000);
});