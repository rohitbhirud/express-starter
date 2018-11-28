const express = require("express"),
      Router  = express.Router(),
      { celebrate, Joi } = require('celebrate'),
      userSchema = require('@app/models/validation/user');


const User = require('@app/models/User');

/********** Login **********/
Router.put("/profile/:id", (req, res, next) => {
  console.log(req.params.id);
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