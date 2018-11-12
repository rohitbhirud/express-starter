const express = require("express"),
      Router  = express.Router(),
      passport = require('passport'),
      bcrypt = require('bcrypt');


const User = require('@app/models/User');

/********** Login **********/
// Router.post("/login", (req, res, next) => {

//     passport.authenticate('local', { session: false }, function(err, user, info) {
  
//       console.log(user);

//       if (err) {
//         console.log(err);
//         return next(err);
//       }

//       if (!user) {
//         __res.unauthorized();
//       }

//       if(user){

//         const tokenData = {
//           userId : user._id,
//           email  : user.email
//         }

//         const response = {
//           userId : user._id,
//           email  : user.email,
//           token  : jwt.sign( tokenData, process.env.TOKENSECRET)
//         }

//         __res.ok({ data : response, message : 'Logged in' });
//       }

//     })(req, res, next); 
// });


/********** Register **********/
Router.post("/register", (req, res) => {
  
  let user = new User();

  user.email = req.body.email;
  user.password = bcrypt.hashSync(req.body.password, 10);

  user.save(function(err) {
      if (err)
          res.boom.notFound(err);

      res.json({ message: 'User created!' });
  });
});

module.exports = Router;