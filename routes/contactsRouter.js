const express = require('express');
const bodyParser = require('body-parser');
const Contact = require('../models/contact');
const authenticate = require('../authenticate');
const cors = require('./cors');

const contactsRouter = express.Router();

contactsRouter.use(bodyParser.json());

// //for CORS problem put his option on every first GET request
// cors.cors middleware is for get request, post and other need cors.corsWithOptions
contactsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Contact.find()
    .then(contacts => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(contacts);
    })
    .catch(err => next(err));
})

.post(cors.corsWithOptions, (req, res, next) => {
    console.log("data: ", req.body)
    if (req.body) {
        Contact.create(req.body)
        .then(contact => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(contact);
        })
        .catch(err => next(err));
    } else {
        const err = new Error('Comment not found in request body');
        err.status = 404;
        return next(err);
    }
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /contact');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Contact.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = contactsRouter;