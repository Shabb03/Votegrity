const request = require('supertest');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const http = require('http');
const app = require('../app');
const db = require('../models/index.js');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

beforeAll(async () => {
    //await sequelize.sync();
});
  
afterAll(async () => {
    //await sequelize.close();
    await server.close();
});

//check if the route returns a list of all security questions
describe('GET /api/user/securityquestions', () => {
    test('should return an array of security questions', async () => {
        const mockSecurityQuestions = [
            { questions: 'Question 1' },
            { questions: 'Question 2' },
        ];
        jest.spyOn(db.SecurityQuestions, 'findAll').mockResolvedValue(mockSecurityQuestions);
        const response = await request(app).get('/api/user/securityquestions');
        expect(response.body.questions).toEqual(['Question 1', 'Question 2']);
    });

    test('should handle errors and return 500 status', async () => {
        jest.spyOn(db.SecurityQuestions, 'findAll').mockRejectedValue(new Error('Mock error'));
        const response = await request(app).get('/api/user/securityquestions');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
    });
});