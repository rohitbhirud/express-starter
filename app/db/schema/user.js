const mongoose = require('mongoose');

Schema = mongoose.Schema;

const User = Schema ({ 
	
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

module.exports = {
	User: mongoose.model ( 'user', User) 
}