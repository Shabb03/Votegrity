const rateLimit = require('express-rate-limit');
const minutesTimout = 5;

const loginLimiter = rateLimit({
    windowMs: minutesTimout * 60 * 1000,
    max: 3,
    handler: (req, res) => {
        res.json({ error: 'Too many login attempts, please try again later.', time: minutesTimout });
    },
});

module.exports = loginLimiter;