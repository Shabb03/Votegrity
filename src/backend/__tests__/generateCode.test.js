const { generateSixDigitCode, generatePublishKey } = require('../controllers/functions/generateCode');

//check if the generateSixDigitCode creates a six digit code
describe('generateSixDigitCode', () => {
    test('should generate a six-digit code', async () => {
        const code = await generateSixDigitCode();
        expect(typeof code).toBe('string');
        expect(code.length).toBe(6);
        expect(/^\d+$/.test(code)).toBe(true);
    });
});

//check if the generatePublishKey creates a ten character key
describe('generatePublishKey', () => {
    test('should generate a ten character key', async () => {
        const publishKey = await generatePublishKey();
        expect(typeof publishKey).toBe('string');
        expect(publishKey.length).toBe(10);
    });
});