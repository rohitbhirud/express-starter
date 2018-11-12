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

UserSchema.methods.validPassword = function( password ) {

	bcrypt.compareSync(password, this.password, function (err, res) {
		return res == true ? true : false;
	});

};


module.exports = mongoose.model('User', UserSchema);