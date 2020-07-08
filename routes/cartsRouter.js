const express = require("express");
const bodyParser = require("body-parser");
const Carts = require("../models/carts");
const authenticate = require("../authenticate");
const cors = require("./cors");

const cartsRouter = express.Router();

cartsRouter.use(bodyParser.json());

cartsRouter.route("/")
  //for CORS problem put his option on every first GET request
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  //cors.cors middleware is for get request, post and other need cors.corsWithOptions
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Carts.find()
    .then((carts) => {
        //To find the cart item which is belonging to the login in user
        return carts ?
            carts.filter(item => 
                JSON.stringify(item.userId) === JSON.stringify(req.user._id)
                ):
            []
    })
      .then((items) => {
        console.log("cart: ", items)
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(items);
      })
      .catch((err) => next(err));
  })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.body) {
            console.log("inputItems: ", req.body)
            Carts.create(req.body)
            .then(cart => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(cart);
            })
            .catch((err) => next(err));
        } else {
            const err = new Error('No item found in request body');
            err.status = 404;
            return next(err);
        }
    })
    .put(cors.corsWithOptions, (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /cart");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      Carts.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    });

cartsRouter
  .route("/:productId")
  //for CORS problem put his option on every first GET request
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  //cors.cors middleware is for get request, post and other need cors.corsWithOptions
  .get(cors.cors, (req, res, next) => {
    Carts.findById(req.params.productId)
      //populate the comments by finding the ID that match
      // .populate('comments.author')
      .then((cart) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cart);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /carts/${req.params.productId}`);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Carts.findByIdAndUpdate(
      req.params.productId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((cart) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cart);
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Carts.findByIdAndDelete(req.params.productId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = cartsRouter;
