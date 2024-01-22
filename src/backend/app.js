const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser')

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
//const electionRoute = require('./routes/electionRoute');

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
//app.use('/api/election', electionRoute);

app.use(passport.initialize());

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = app;