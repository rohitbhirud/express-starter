const express = require("express"),
      Router  = express.Router(),
      passport = require('passport')
      __res = require('../../helpers/response'),
      jwt = require('jsonwebtoken');

/********** Login **********/
Router.post("/login", (req, res, next) => {

    passport.authenticate('local', { session: false }, function(err, user, info) {
  
      console.log(user);

      if (err) {
        console.log(err);
        return next(err);
      }

      if (!user) {
        __res.unauthorized();
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

        __res.ok({ data : response, message : 'Logged in' });
      }

    })(req, res, next); 
});


/********** Register **********/
Router.post("/register", (req, res) => {
  
  // register(req.body)
  //   .then(user => {
  //     console.log(user);
  //     __res.ok(user);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
  
});

module.exports = Router;