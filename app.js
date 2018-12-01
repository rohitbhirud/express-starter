require('module-alias/register');
require('dotenv').config();

// set config dir & require it
process.env.NODE_CONFIG_DIR = './app/config';
const config = require('config');

const express = require('express'),
    app = require("express")(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
/******************* Custom Requires *******************/
    methodOverride = require('method-override'),
    jwt = require('jsonwebtoken'),
    boom = require('express-boom'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    { errors, isCelebrate } = require('celebrate');


/******************* Local Requires *******************/
// const logger = require("./app/helpers/logger");
const strategies = require('./app/controllers/auth/strategies');


/******************* Middlewares *******************/
app.use(boom());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/public')));

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
    JWT Athentication Middleware
***************************************************/
app.use('/api/v1/', (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.boom.unauthorized('No token provided');
  }

  const SECRET = process.env.TOKENSECRET;
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) 
      return res.boom.unauthorized('Invalid token');

    if (!decoded || decoded.id !== req.body.id)
      return res.boom.unauthorized('Invalid userId or userId not present');

    next();
  });
});

/***************************************************
    Authentication Middlewares Strategies
***************************************************/
passport.use(strategies.local);


/***************************************************
    Controllers
***************************************************/
const controllers = require("./app/controllers/");

/****** Authentication Controllers ******/
app.use('/', controllers.home);
app.use('/auth/', controllers.auth.local);
app.use('/api/v1/', controllers.profile);


/***************************************************
    Mongoose Connect
***************************************************/
mongoose.connect(`mongodb://${config.get('db.host')}/${config.get('db.database')}`, {
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
    
    // return errors if validation fails
    if (err.name == 'ValidationError' && err.isJoi ) {
      // console.log(err.details);
      return res.boom.badRequest(err.details[0].message);
    }

    if (err instanceof SyntaxError) {
        res.boom.badRequest("invalid json");
    } else {
        res.boom.badRequest(err.message);
    }
});


/**
 * Get port from environment.
 */

var port = config.get('App.port') || '3000';;

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port);
app.on('error', onError);
app.on('listening', onListening);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;