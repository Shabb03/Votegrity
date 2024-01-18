const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
//const JwtStrategy = require('passport-jwt').Strategy;
//const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('./sequelize');
//const { Voter } = require('./sequelize'); // Import your Sequelize User model
require('dotenv').config();
const jwtSecret = process.env.SECRET_KEY;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM Voter WHERE id = ?', [jwt_payload.sub]);
        if (!rows || rows.length === 0) {
            return done(null, false);
        }
        return done(null, rows[0]);
    } 
    catch (error) {
        return done(error, false);
    }
}));

module.exports = passport;