const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit');

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const electionRoute = require('./routes/electionRoute');
const statusRoute = require('./routes/statusRoute');
const testRoute = require('./routes/testRoute');

const minutesTimout = 1;
const limiter = rateLimit({
    windowMs: minutesTimout * 60 * 1000,
    max: 200,
    handler: (req, res) => {
        res.json({ error: 'Too many requests from this IP, please try again later.'});
    },
});

const corsOptions = {
    origin: process.env.ORIGIN || 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204, 
};

const app = express();
app.use(express.json());
app.use(limiter);
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API Routes, {HOST}:{PORT}/{URL} e.g (localhost:3000/api/user)
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/election', electionRoute);
app.use('/api/status', statusRoute);
app.use('/api/test', testRoute);

app.use(passport.initialize());

app.use((req, res) => {
    res.status(404).send('URL Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = app;