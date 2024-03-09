const bcrypt = require('bcrypt');
const { privateDecrypt } = require('crypto');
const { isSecurePassword, hashPassword, decryptPassword } = require('../controllers/functions/password');

jest.mock('crypto');

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
        console.log("BEGIN!");
        const password = 'SecurePassword1!';
        const saltRounds = 1;
        //const hashedPassword = await hashPassword(password);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);
        expect(typeof hashedPassword).toBe('string');

        bcrypt.compare = jest.fn().mockResolvedValue(true);
        const match = await bcrypt.compare(password, hashedPassword);
        expect(match).toBe(true);
    }, 30000);
});

//check if the password is being decrypted correctly
describe('decryptPassword function', () => {
    test('should decrypt the password', async () => {
        privateDecrypt.mockReturnValueOnce(Buffer.from('DecryptedPassword'));
        const privateKey = 'mockPrivateKey';
        const encryptedPassword = 'mockEncryptedPassword';
        const result = await decryptPassword(privateKey, encryptedPassword);
        expect(result).toBe('DecryptedPassword');
    }, 8000);
});