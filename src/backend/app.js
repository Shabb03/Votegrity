const express = require('express');
const passport = require('passport');

//const addCandidateRoute = require('./routes/addCandidateRoute');
//const addElectionRoute = require('./routes/addElectionRoute');
//const dashboardRoute = require('./routes/dashboardRoute');
//const loginRoute = require('./routes/loginRoute');
//const profileRoute = require('./routes/profileRoute');
const registerRoute = require('./routes/registerRoute');
//const resetPasswordRoute = require('./routes/resetPasswordRoute');
//const resetRoute = require('./routes/resetRoute');
//const voteRoute = require('./routes/voteRoute');
//const winnerRoute = require('./routes/winnerRoute');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/register', registerRoute);

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