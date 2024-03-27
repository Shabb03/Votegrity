const rateLimit = require('express-rate-limit');
const minutesTimout = 1;  //update to be 5 minutes later

//limit the amount of times a user can attempt to login incorrectly and set a timeout
const loginLimiter = rateLimit({
    windowMs: minutesTimout * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.json({ error: 'Too many login attempts, please try again later.', time: minutesTimout });
    },
});

module.exports = loginLimiter;