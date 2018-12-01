const mongoose = require('mongoose'),
	  bcrypt = require('bcrypt');
	  
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	
	email : {
		type :  String,
		trim : true,
		unqiue : true,
		required : true
	},
	
	password : {
		type : String,
		required : true,
		trim:true
	},

	username: {
		type: String,
		trim: true
	},

	avatar: {
		type: String,
		default: ''
	},

	gender: {
		type: String,
		default: 'male'
	},

	birthday: {
		type: Date
	},

	country: {
		type: String,
		default: 'india'
	},

	bio: {
		type: String
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

	return bcrypt.compareSync(password, this.password, function (err, res) {
		return res == true ? true : false;
	});

};

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);