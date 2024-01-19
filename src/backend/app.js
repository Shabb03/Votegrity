const express = require('express');
const passport = require('passport');

//const registerRoute = require('./routes/registerRoute');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const electionRoute = require('./routes/electionRoute');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

//app.use('/api/register', registerRoute);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/election', electionRoute);

/*
app.use('/', routes);
app.use(passport.initialize());
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