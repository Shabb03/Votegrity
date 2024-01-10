const http = require('http');
const mysql = require('mysql');
const app = require('./app');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

const connection = mysql.createConnection({
    host: 'your_mysql_host',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'your_mysql_database',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});
  
  

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});