var express = require('express'),
	Router = express.Router();

/* GET home page. */
Router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = Router;
