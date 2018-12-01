const express = require("express"),
      Router  = express.Router(),
      passport = require('passport'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      { celebrate, Joi } = require('celebrate'),
      userSchema = require('@app/models/validation/user');


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
Router.post("/register", celebrate({
  body: userSchema
}), (req, res) => {

  // check if user already exists
  _findUser( req.body.email )
    .then( oldUser => {
      if(oldUser !== null){
        return Promise.reject('User already exists');
      }
      
      let user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      });

      user.save(function(err) {
          if (err)
              return Promise.reject(err);

          res.json({ message: 'User created!' });
      });
    })
    .catch( err => {
      res.boom.badRequest(err);
    });

});

const _findUser = ( email ) => {
  let query = { email : email };
  return User.findOne( query );
}

module.exports = Router;