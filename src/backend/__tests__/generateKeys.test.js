const { generateKeys } = require('../controllers/functions/generateKeys');
const { generateKeyPairSync } = require('crypto');

jest.mock('crypto');

describe('generateKeys', () => {
    test('should generate key pair', async () => {
        const mockPrivateKey = 'mockPrivateKey';
        const mockPublicKey = 'mockPublicKey';
    
        generateKeyPairSync.mockReturnValueOnce({
            privateKey: mockPrivateKey,
            publicKey: mockPublicKey,
        });
    
        const result = await generateKeys();
    
        expect(generateKeyPairSync).toHaveBeenCalledWith('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
  
        expect(result).toEqual({
            privateKey: mockPrivateKey,
            publicKey: mockPublicKey,
        });
    });
});
