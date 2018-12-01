const express = require("express"),
      Router  = express.Router(),
      { celebrate, Joi } = require('celebrate'),
      { ObjectId } = require('mongodb'),
      userSchema = require('@app/models/validation/user');


const User = require('@app/models/User');

/********** Get Profile Data **********/
Router.get("/profile/:id", (req, res) => {
  const userId = req.params.id;

  // check of userid is valid
  if (!ObjectId.isValid(userId)) {
    return res.boom.badRequest('Invalid id or malformed id');
  }

  // check if user exists
  User.findOne(
    { _id: userId },
    { password: 0 }
    )
    .then(user => {
      if (user === null) return res.boom.notFound('User not found');

      res.message("success", user);
    })
  // get user data
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