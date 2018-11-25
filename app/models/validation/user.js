const { Joi } = require('celebrate');

const userSchema = Joi.object().keys({
	email: Joi.string().email().required().trim().label('Email'),
	password: Joi.string().trim(),
	token: Joi.string().token()
});

module.exports = userSchema;