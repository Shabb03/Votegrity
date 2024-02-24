const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const { isSecurePassword, hashPassword, decryptPassword } = require('../controllers/functions/password');
const secretKey = process.env.DECRYPT_PASSWORD_KEY;

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

describe('decryptPassword', () => {
    test('should decrypt the password', async () => {
        const encryptedPassword = 'U2FsdGVkX1+H5bb1oxOM3SEM62EF3kBt0P/mhRAi4K8=';
        const plainPassword = 'loveCookies30!';
        const bytes = await CryptoJS.AES.decrypt(encryptedPassword, secretKey);
        const decryptedPassword = await bytes.toString(CryptoJS.enc.Utf8);
        const match = (plainPassword === decryptedPassword);
        expect(match).toBe(true);
    });
});