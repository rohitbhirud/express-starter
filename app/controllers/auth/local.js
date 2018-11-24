const express = require("express"),
      Router  = express.Router(),
      passport = require('passport'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');


const User = require('@app/models/User');

/********** Login **********/
Router.post("/login", (req, res, next) => {

    passport.authenticate('local', { session: false }, function(err, user, info) {
  
      if (err) {
        return next(err);
      }

      if (!user) {
        res.boom.unauthorized(info.message);
      }

      if(user){

        const tokenData = {
          userId : user._id,
          email  : user.email
        }

        const response = {
          userId : user._id,
          email  : user.email,
          token  : jwt.sign( tokenData, process.env.TOKENSECRET)
        }

        res.json({ data : response, message : 'Logged in' });
      }

    })(req, res, next); 
});


/********** Register **********/
Router.post("/register", (req, res) => {
  
  let user = new User();

  user.email = req.body.email;
  user.password = bcrypt.hashSync(req.body.password, 10);

  user.save(function(err) {
      if (err)
          return res.boom.unauthorized(err);

      res.json({ message: 'User created!' });
  });
});

module.exports = Router;