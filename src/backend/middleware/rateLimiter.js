const rateLimit = require('express-rate-limit');
const minutesTimout = 1;

const loginLimiter = rateLimit({
    windowMs: minutesTimout * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.json({ error: 'Too many login attempts, please try again later.', time: minutesTimout });
    },
});

module.exports = loginLimiter;