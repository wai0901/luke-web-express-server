require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
// const config = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cartsRouter = require('./routes/cartsRouter');
const mainDataRouter = require('./routes/mainDataRouter');
const ordersRouter = require('./routes/ordersRouter');



const mongoose = require('mongoose');

// const url = config.mongoUrl;
const url = process.env.MONGO_URL;

const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

const app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//for passport if only use for session base authentication
//is middleware function provided by passport to check the incoming user request if there is existing session for this user.
app.use(passport.initialize());

app.use('/', indexRouter);
//It has to be before Authentication session, because need to let user login or signup before Auth check.
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/carts', cartsRouter);
app.use('/main', mainDataRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
