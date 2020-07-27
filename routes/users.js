const express = require('express');
const User = require('../models/user');
const Carts = require('../models/carts');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const router = express.Router();

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
/* GET users listing. */ 
//only Admin
router.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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

router.post('/login', cors.corsWithOptions, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful!', err: info});
        }
        req.logIn(user, err => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
            }

            const userInfo = {
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                _id: user._id,
                billingAddress: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    tel: user.tel,
                    email: user.email,
                    street: user.street,
                    city: user.city,
                    state: user.state,
                    zip: user.zip
                },
                deliveryAddress: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    tel: user.tel,
                    email: user.email,
                    street: user.street,
                    city: user.city,
                    state: user.state,
                    zip: user.zip
                },
                tel: user.tel,
                email: user.email,
                admin: user.admin
            }

            //check if the user has previous item saved in cart before login
            Carts.find()
            .then((carts) => {
                //To find the cart item which is belonging to the login in user
                return carts ?
                    carts.filter(item => 
                        JSON.stringify(item.userId) === JSON.stringify(user._id)
                        ):
                    []
            })
            .then(items => {
                const token = authenticate.getToken({_id: req.user._id});
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, user: userInfo, serverItems: items, token: token, status: 'You are successfully logged in!'});
            }) 
        });
    })(req, res, next);
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
});

//facebook route
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        const token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
    }
});


module.exports = router;
