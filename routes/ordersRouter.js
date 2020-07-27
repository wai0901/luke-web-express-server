const express = require('express');
const bodyParser = require('body-parser');
const Order = require('../models/order');
const authenticate = require('../authenticate');
const cors = require('./cors');

const ordersRouter = express.Router();

ordersRouter.use(bodyParser.json());


// //for CORS problem put his option on every first GET request
// cors.cors middleware is for get request, post and other need cors.corsWithOptions
ordersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get((req, res, next) => {
    Order.find()
    .populate('User')
    .then(order => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    })
    .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.body) {
        Order.create(req.body)
        .then(order => {
        //   Order.findById(order._id)
        //   .populate('User')
        //   .then(order => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order);
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
    res.end('PUT operation not supported on /order');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = ordersRouter;