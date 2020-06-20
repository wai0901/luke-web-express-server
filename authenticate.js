const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config.js');


exports.local = passport.use(new LocalStrategy(User.authenticate()));

//when using session with passport, need to do the serialize and deserialize the User
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
    //expiresIn option for how long the token will be expire, usualy few days in realworld
    return jwt.sign(user, config.secretKey, {expiresIn: 259200});
};

const opts = {};
//this method to specify how the webtoken to be extract from incoming message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if(err) {
                    //found err, and no user was found
                    return done(err, false);
                } else if (user) {
                    //no err, and user was found
                    return done(null, user);
                } else {
                    //no err, and no user was found
                    return done(null, false);
                }
            });
        }
    )
);

//session false mean we not using session here
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin !== true) {
        err = new Error(`Username: ${req.user.username} are not authorized to perform this operation!`);
        err.status = 403;
        return next(err);
    } else {
        return next();
    }
}