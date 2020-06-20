const express = require('express');
const bodyParser = require('body-parser');
const WebsiteData = require('../src/websiteData');
const authenticate = require('../authenticate');
const cors = require('./cors');

const categoryRouter = express.Router();
categoryRouter.use(bodyParser.json());


categoryRouter.route('/')
//for CORS problem put his option on every first GET request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//cors.cors middleware is for get request, post and other need cors.corsWithOptions
.get(cors.cors, (req, res, next) => {
  if (WebsiteData) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(WebsiteData);
  } else {
      err = new Error("No data had found!"); 
      err.status = 403; 
      return next(err);
  }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /category');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /category');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /category');
});

categoryRouter.route('/:categoryId')
//for CORS problem put his option on every first GET request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//cors.cors middleware is for get request, post and other need cors.corsWithOptions
.get(cors.cors, (req, res, next) => {
  if (WebsiteData[req.params.categoryId]) {
      res.statusCode = 200;
      // res.setHeader('Content-Type', 'application/json');
      res.json(WebsiteData[req.params.categoryId]);
  } else {
      err = new Error("No data had found!"); 
      err.status = 403; 
      return next(err);
  }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /category');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /category');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /category');
});

module.exports = categoryRouter;