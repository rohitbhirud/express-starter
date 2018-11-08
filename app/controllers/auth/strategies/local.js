const LocalStrategy = require('passport-local').Strategy;

const local = new LocalStrategy(
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
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