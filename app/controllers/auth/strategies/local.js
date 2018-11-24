const LocalStrategy = require('passport-local').Strategy;
const User = require('@app/models/User');

const local = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) {
      	return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      if ( !user.validPassword(password) ) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      return done(null, user);
    });
  }
);

module.exports = local;