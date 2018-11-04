require('dotenv').config()

var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/*************************************
    Mongoose Connect
*************************************/
mongoose.connect(process.env.MONGOSERVER)
    .then(con => {
        console.log("Successfully connected to MongoDB");
    })
    .catch(error => {
        console.error(`Error connecting to MongoDB ${error}`);
        process.exit(0);
    });

module.exports = app;
