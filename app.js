require('dotenv').config();
require('./app/config');

const express = require('express'),
    app = require("express")(),
    path = require('path'),
    cookieParser = require('cookie-parser'),

/******************* Custom Requires *******************/
    methodOverride = require('method-override'),
    boom = require('express-boom'),
    mongoose = require('mongoose');


/******************* Custom Middlewares *******************/
const logger = require("./app/helpers/logger");
// console.log(global);

app.use(boom());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/***************************************************
    Middleware to support CORS
***************************************************/
const allowCrossDomain = function(req, res, next) {
    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Authentication, x-access-token, X-Requested-With');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

/***************************************************
    Controllers
***************************************************/
const indexRouter = require('./app/controllers/index');
const usersRouter = require('./app/controllers/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

/***************************************************
    Mongoose Connect
***************************************************/
mongoose.connect(process.env.MONGOSERVER, {
        useNewUrlParser: true
    })
    .then(con => {
        console.log("Successfully connected to MongoDB");
    })
    .catch(error => {
        console.error(`Error connecting to MongoDB ${error}`);
        process.exit(0);
    });

/***************************************************
    Default Error Handler
***************************************************/
app.use((err, req, res, next) => {

    if (err.isServer) {
        // log the error...
        console.log(err);
    }
    return res.status(err.output.statusCode).json(err.output.payload);
});

module.exports = app;