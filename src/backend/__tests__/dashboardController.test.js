const db = require('../models/index.js');
const { electionDetails } = require('../controllers/dashboardController');

// Mock Sequelize models
jest.mock('../models/index', () => ({
    Election: {
        findAll: jest.fn(),
    },
}));

describe('dashboardController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock function calls after each test
    });

    it('should return details of active elections', async () => {
        const activeElectionsData = [
            {
                id: 1,
                title: 'Election 1',
                description: 'Description 1',
                startDate: '2024-04-01',
                endDate: '2024-04-30',
                resultDate: '2024-05-15',
                candidateNumber: 3,
                addedCandidates: [],
                ageRestriction: 18,
                authEmail: true,
                authCitizenship: true,
                type: 'Majority',
                isActive: true,
            },
            {
                id: 2,
                title: 'Election 2',
                description: 'Description 2',
                startDate: '2024-05-01',
                endDate: '2024-05-31',
                resultDate: '2024-06-15',
                candidateNumber: 2,
                addedCandidates: [],
                ageRestriction: 21,
                authEmail: false,
                authCitizenship: true,
                type: 'Ranked',
                isActive: true,
            }
        ];
        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };
        db.Election.findAll.mockResolvedValueOnce(activeElectionsData);
        await electionDetails(req, res);
        console.log("res.json.mock.calls", res.json.mock.calls, res.json.mock.calls[0][0]);
        expect(res.json).toHaveBeenCalledWith({ activeElections: expect.any(Array) });
    });

    it('should return error if no active elections found', async () => {
        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };
        db.Election.findAll.mockResolvedValueOnce();
        await electionDetails(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: 'No active election found', election: false });
    });

    it('should return an error if an error occurs', async () => {
        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        db.Election.findAll.mockRejectedValueOnce(new Error('Database error'));
        await electionDetails(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
});
