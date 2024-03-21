const { privateDecrypt } = require('crypto');
const { decryptPassword } = require('../controllers/functions/password');

jest.mock('crypto');

//check if the password is being decrypted correctly
describe('decryptPassword function', () => {
    test('should decrypt the password', async () => {
        jest.mock('crypto');
        privateDecrypt.mockReturnValueOnce(Buffer.from('DecryptedPassword'));
        const privateKey = 'mockPrivateKey';
        const encryptedPassword = 'mockEncryptedPassword';
        const result = await decryptPassword(privateKey, encryptedPassword);
        expect(result).toBe('DecryptedPassword');
    }, 8000);
});