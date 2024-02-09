const generateSixDigitCode = require('../controllers/functions/generateCode');

//check if the generateSixDigitCode creates a six digit code
describe('generateSixDigitCode', () => {
    test('should generate a six-digit code', () => {
        const code = generateSixDigitCode();
        expect(typeof code).toBe('string');
        expect(code.length).toBe(6);
        expect(/^\d+$/.test(code)).toBe(true);
    });
});