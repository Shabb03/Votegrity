//require('dotenv').config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const http = require('http');
const app = require('../app');
const { sequelize, closeDatabase } = require('../sequelize');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

/*
describe('Server', () => {
    test('should listen on port 3000', (done) => {
      server.listen(port, async () => {
        await expect((server.address().port).toString()).toEqual(port.toString());
        await server.close(done);
        await sequelize.close(done);
      });
    }, 30000);
});
*/

sequelize.close();
//closeDatabase();

describe('Server', () => {
    test('should listen on port 3000', async () => {
      await new Promise((resolve) => {
        server.listen(port, async () => {
          expect(server.address().port.toString()).toEqual(port.toString());
          await server.close(resolve);
          //await closeDatabase();
          //await sequelize.close(resolve);
        });
      });
    }, 30000);
});