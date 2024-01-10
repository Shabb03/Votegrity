const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

/*
app.get('/greet/:name', (req, res) => {
  const { name } = req.params;
    res.send(`Hello, ${name}!`);
});
*/

/*
app.post('/api/data', (req, res) => {
    const data = req.body;
    // Do something with the posted data
    res.json({ message: 'Data received successfully!', data });
});
*/

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;