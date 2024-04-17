const CryptoJS = require('crypto-js');
const secretKey = 'testSecretKey';

//check if the password is being decrypted correctly
describe('decryptPassword function', () => {
    test('should decrypt the password', async () => {
        const encryptedPassword = 'U2FsdGVkX1/tdvfaPjYYHbf1d11k3T/XWN9hkBoaa68=';
        const plainPassword = 'loveCookies30!';
        const bytes = await CryptoJS.AES.decrypt(encryptedPassword, secretKey);
        const decryptedPassword = await bytes.toString(CryptoJS.enc.Utf8);
        const match = (plainPassword === decryptedPassword);
        expect(match).toBe(true);
    }, 8000);
});