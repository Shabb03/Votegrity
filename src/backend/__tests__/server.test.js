const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const http = require('http');
const app = require('../app');
const db = require('../models/index.js');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

/*
beforeAll(async () => {
    //await sequelize.sync();
});
  
afterAll(async () => {
    await sequelize.close();
});

async function closeServer(resolve) {
    await sequelize.close();
    await server.close(resolve);
}
*/

//check if the server runs on port 3000
describe('Server', () => {
    test('should listen on port 3000', async () => {
        //await new Promise((resolve) => {
            server.listen(port, async () => {
                expect(server.address().port.toString()).toEqual(port.toString());
                //await server.close(resolve);
            });
        //});
    }, 30000);
});