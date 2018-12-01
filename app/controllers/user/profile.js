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
    .catch(err => {
      res.boom.badRequest("error getting user.", err);
    });
});

/********** Update Profile Data **********/
Router.put("/profile/:id", celebrate({
  body: userSchema
}), (req, res) => {
  const userId = req.params.id;

  // check of userid is valid
  if (!ObjectId.isValid(userId)) {
    return res.boom.badRequest('Invalid id or malformed id');
  }

  const user = req.body;

  let update = {
    $set: user
  };

  User.findOneAndUpdate(
    { _id: userId },
    update,
    { new: true, projection: { password: 0 } })
    .then(user => {
      if (!user) return res.boom.notFound('User not found');

      res.message("success", user);
    })
    .catch(err => {
      res.boom.badRequest("error updating user.", err);
    });
});


module.exports = Router;