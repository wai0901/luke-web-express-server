const express = require('express');
const bodyParser = require('body-parser');
const Carts = require('../models/carts');
const authenticate = require('../authenticate');
const cors = require('./cors');

const cartsRouter = express.Router();

cartsRouter.use(bodyParser.json());


cartsRouter.route('/')
//for CORS problem put his option on every first GET request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//cors.cors middleware is for get request, post and other need cors.corsWithOptions
.get(cors.cors, (req, res, next) => {
    Carts.find()
    //populate the comments by finding the ID that match
    // .populate('comments.author')
    .then(carts => {
        console.log(carts)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(carts);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {
  Carts.create(req.body)
  .then(cart => {
      console.log('Added item to cart', cart);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(cart);
  })
  .catch(err => next(err));
})
.put(cors.corsWithOptions, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /cart');
})
.delete(cors.corsWithOptions, (req, res, next) => {
  Carts.deleteMany()
  .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
  })
  .catch(err => next(err));
});


cartsRouter.route('/:productId')
//for CORS problem put his option on every first GET request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//cors.cors middleware is for get request, post and other need cors.corsWithOptions
.get(cors.cors, (req, res, next) => {
  Carts.findById(req.params.productId)
  //populate the comments by finding the ID that match
  // .populate('comments.author')
  .then(cart => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(cart);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, (req, res) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /carts/${req.params.productId}`);
})
.put(cors.corsWithOptions, (req, res, next) => {
  Carts.findByIdAndUpdate(req.params.productId, {
      $set: req.body
  }, { new: true })
  .then(cart => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(cart);
  })
  .catch(err => next(err));
})
.delete(cors.corsWithOptions, (req, res) => {
  Carts.findByIdAndDelete(req.params.productId)
  .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
  })
  .catch(err => next(err));
});



module.exports = cartsRouter;