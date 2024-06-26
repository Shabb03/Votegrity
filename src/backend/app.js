const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit');

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const electionRoute = require('./routes/electionRoute');
const statusRoute = require('./routes/statusRoute');

//limit the number of requests per minute from an IP address to prevent ddos attacks
const minutesTimout = 5;
const limiter = rateLimit({
    windowMs: minutesTimout * 60 * 1000,
    max: 200,
    handler: (req, res) => {
        res.json({ error: 'Too many requests from this IP, please try again later.' });
        console.log("too many requests");
    },
});

//only allow certain url's to interact with the server
const allowedOrigins = ['http://localhost:8080', 'http://localhost:8081'];
const corsOptions = {
    origin: allowedOrigins
};

const app = express();
app.use(express.json());
app.use(limiter);
app.use(cors(corsOptions));

//Disable the X-Powered-By header
app.disable('x-powered-by');

//Content Security Policiy (CSP) to protect against Cross Site Scripting (XSS) and data injection attacks
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
    },
}));

app.use((req, res, next) => {
    //Set X-Content-Type-Options header to prevent MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    //Set X-Frame-Options header to deny framing by other sites
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, this is a test server!\n');
});

//API Routes, {HOST}:{PORT}/{URL} e.g (localhost:3000/api/user)
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/election', electionRoute);
app.use('/api/status', statusRoute);

app.use(passport.initialize());

app.use((req, res) => {
    res.status(404).send('URL Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = app;