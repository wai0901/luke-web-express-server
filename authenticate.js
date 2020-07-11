require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require('passport-facebook-token');


const secretKey = process.env.SECRET_KEY;


exports.local = passport.use(new LocalStrategy(User.authenticate()));

//when using session with passport, need to do the serialize and deserialize the User
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
    //expiresIn option for how long the token will be expire, usualy few days in realworld
    return jwt.sign(user, secretKey, {expiresIn: 259200});
};

const opts = {};
//this method to specify how the webtoken to be extract from incoming message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

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

// Facebook
exports.facebookPassport = passport.use(
    new FacebookTokenStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET
        }, 
        (accessToken, refreshToken, profile, done) => {
            User.findOne({facebookId: profile.id}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (!err && user) {
                    return done(null, user);
                } else {
                    user = new User({ username: profile.displayName });
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        }
    )
);