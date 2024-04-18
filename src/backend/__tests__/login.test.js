const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { login } = require('../controllers/loginController');
const db = require('../models/index');

// Mock Sequelize models
jest.mock('../models/index', () => ({
    Admin: {
        findOne: jest.fn(),
    },
    Voter: {
        findOne: jest.fn(),
    },
}));

// Mock bcrypt functions
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

// Mock jwt functions
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('login controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if email or password is missing', async () => {
        const req = {
            body: {
                email: '',
                password: '',
            },
        };
        const res = {
            json: jest.fn(),
        };
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: 'All required inputs not provided' });
    });

    it('should return an error if account with email not found', async () => {
        const req = {
            body: {
                email: 'nonexistent@example.com',
                password: 'password',
            },
        };
        const res = {
            json: jest.fn(),
        };

        db.Voter.findOne.mockResolvedValueOnce(null);
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: 'Account with this email not found' });
    });

    it('should return an error if password is incorrect', async () => {
        const req = {
            body: {
                email: 'user@example.com',
                password: 'password',
            },
        };
        const res = {
            json: jest.fn(),
        };
        const user = {
            id: 1,
            email: 'user@example.com',
            password: 'hashedPassword',
            authenticated: true,
        };

        db.Voter.findOne.mockResolvedValueOnce(user);
        bcrypt.compare.mockResolvedValueOnce(false);
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: 'Password is incorrect' });
    });

    it('should return token and user details for authenticated user', async () => {
        const req = {
            body: {
                email: 'user@example.com',
                password: 'password',
            },
        };
        const res = {
            json: jest.fn(),
        };
        const user = {
            id: 1,
            email: 'user@example.com',
            password: 'hashedPassword',
            authenticated: true,
        };

        db.Voter.findOne.mockResolvedValueOnce(user);
        bcrypt.compare.mockResolvedValueOnce(true);
        jwt.sign.mockReturnValueOnce('mockToken');
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({
            email: 'user@example.com',
            token: 'mockToken',
            authenticated: true,
            admin: false,
        });
    });

    it('should return token and admin details for admin', async () => {
        const req = {
            body: {
                email: 'admin@example.com',
                password: 'password',
            },
        };
        const res = {
            json: jest.fn(),
        };
        const admin = {
            id: 1,
            email: 'admin@example.com',
            password: 'hashedPassword',
        };
        db.Admin.findOne.mockResolvedValueOnce(admin);
        bcrypt.compare.mockResolvedValueOnce(true);
        jwt.sign.mockReturnValueOnce('mockToken');
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({
            email: 'admin@example.com',
            token: 'mockToken',
            admin: true,
        });
    });

    it('should return an error if an error occurs', async () => {
        const req = {
            body: {
                email: 'user@example.com',
                password: 'password',
            },
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        db.Voter.findOne.mockRejectedValueOnce(new Error('Database error'));
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: 'An error has occurred trying to log in' });
    });
});