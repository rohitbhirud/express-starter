const mongoose = require('mongoose'),
	  bcrypt = require('bcrypt');
	  
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	
	email : {
		type :  String,
		trim : true,
		unqiue : true,
		required : true,
	},
	
	password : {
		type : String,
		required : true,
		trim:true
	},

	token : {
		type : String
	},

	createdAt: {
	    type: Date,
	    default: Date.now()
  	},
  	modifiedAt: {
	    type: Date,
	    default: Date.now()
  	}
});

// custom method for user model
UserSchema.methods.validPassword = function( password ) {

	bcrypt.compareSync(password, this.password, function (err, res) {
		return res == true ? true : false;
	});

};

// Sets the createdAt parameter equal to the current time
BookSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);