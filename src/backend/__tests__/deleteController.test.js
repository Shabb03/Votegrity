const { deleteCode, deleteAccount } = require('../controllers/deleteController');
const db = require('../models/index.js');
const sendEmail = require('../controllers/thirdParty/email');
const { generateSixDigitCode } = require('../controllers/functions/generateCode');

// Mock Sequelize models
jest.mock('../models/index', () => ({
    Voter: {
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock('../controllers/thirdParty/email', () => ({
    sendEmail: jest.fn(),
}));

jest.mock('../controllers/functions/generateCode', () => ({
    generateSixDigitCode: jest.fn().mockReturnValue('123456'), // Mock the generateSixDigitCode function to return a fixed value for testing
}));

describe('deleteController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock function calls after each test
    });

    describe('deleteCode', () => {
        it('should send email with delete code', async () => {
            const req = { user: { id: 1 } };
            const res = { json: jest.fn() };
            const user = { id: 1, email: 'test@example.com', save: jest.fn() };
            db.Voter.findByPk.mockResolvedValueOnce(user);
            await deleteCode(req, res);
            expect(generateSixDigitCode).toHaveBeenCalled();
            expect(user.resetToken).toBe('123456');
            expect(res.json).toHaveBeenCalledWith({ message: 'Email sent' });
        });

        it('should return an error if an error occurs', async () => {
            const req = { user: { id: 1 } };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            db.Voter.findByPk.mockRejectedValueOnce(new Error('Database error'));
            await deleteCode(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
        });
    });

    describe('deleteAccount', () => {
        it('should delete account if token is valid', async () => {
            const req = { user: { id: 1 }, body: { token: '123456' } };
            const res = { json: jest.fn() };
            const user = { id: 1, email: 'test@example.com', resetToken: '123456' };
            db.Voter.findByPk.mockResolvedValueOnce(user);
            await deleteAccount(req, res);
            expect(db.Voter.findByPk).toHaveBeenCalledWith(1);
            expect(db.Voter.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.json).toHaveBeenCalledWith({ message: 'Account deleted successfully' });
        });

        it('should handle invalid token and return error', async () => {
            const req = { user: { id: 1 }, body: { token: '654321' } };
            const res = { json: jest.fn() };
            const user = { id: 1, email: 'test@example.com', resetToken: '123456' };
            db.Voter.findByPk.mockResolvedValueOnce(user);
            await deleteAccount(req, res);
            expect(db.Voter.findByPk).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid code' });
        });

        it('should return an error if an error occurs', async () => {
            const req = { user: { id: 1 }, body: { token: '123456' } };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            db.Voter.findByPk.mockRejectedValueOnce(new Error('Database error'));
            await deleteAccount(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
        });
    });
});