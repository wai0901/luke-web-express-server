const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */ 
//only Admin
router.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find()
    .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    })
});

router.post('/signup', (req, res) => {
    User.register(
        new User({ username: req.body.username}),
        req.body.password,
        (err, user) => {
            if (err) {
              //interal server error
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                if (req.body.street) {
                    user.street = req.body.street;
                }
                if (req.body.city) {
                    user.city = req.body.city;
                }
                if (req.body.state) {
                    user.state = req.body.state;
                }
                if (req.body.zip) {
                    user.zip = req.body.zip;
                }
                if (req.body.tel) {
                    user.tel = req.body.tel;
                }
                if (req.body.username) {
                    user.username = req.body.username;
                }
                if (req.body.email) {
                    user.email = req.body.email;
                }
                if (req.body.promotion) {
                    user.promotion = req.body.promotion;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                })
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successfull!'});
                });
            }
        }
    );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    //for jWT
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
    // req.logout();
    // res.redirect('/');
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    } else {
      const err = new Error('You are not logged in!');
      err.status = 403;
      return next(err);
    }
});

module.exports = router;
