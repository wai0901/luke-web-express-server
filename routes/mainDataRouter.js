const express = require('express');
const bodyParser = require('body-parser');
const WebsiteData = require('../src/websiteData');
const authenticate = require('../authenticate');
const cors = require('./cors');

const mainDataRouter = express.Router();
mainDataRouter.use(bodyParser.json());


mainDataRouter.route('/')
//for CORS problem put his option on every first GET request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//cors.cors middleware is for get request, post and other need cors.corsWithOptions
.get(cors.cors, (req, res, next) => {
    if (WebsiteData.homeMenu) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(WebsiteData.homeMenu);
    } else {
        err = new Error("No data had found!"); 
        err.status = 403; 
        return next(err);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /mainData');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /mainData');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /mainData');
});

//For Category items
mainDataRouter.route('/:categoryId')
//for CORS problem put his option on every first GET request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//cors.cors middleware is for get request, post and other need cors.corsWithOptions
.get(cors.cors, (req, res, next) => {
    if (WebsiteData[req.params.categoryId]) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(WebsiteData[req.params.categoryId]);
    } else {
        err = new Error("No data had found!"); 
        err.status = 403; 
        return next(err);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /mainData');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /mainData');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /mainData');
});

//For individual items
mainDataRouter.route('/:categoryId/:itemId')
//for CORS problem put his option on every first GET request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//cors.cors middleware is for get request, post and other need cors.corsWithOptions
.get(cors.cors, (req, res, next) => {
    if (WebsiteData[req.params.itemId]) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(WebsiteData[req.params.itemId]);
    } else {
        err = new Error("No data had found!"); 
        err.status = 403; 
        return next(err);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /mainData');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /mainData');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /mainData');
});

module.exports = mainDataRouter;