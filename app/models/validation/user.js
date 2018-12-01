const { Joi } = require('celebrate');

const userSchema = Joi.object().keys({
	email: Joi.string().email().trim().label('Email'),
	password: Joi.string().trim(),
	username: Joi.string().trim().allow(''),
	avatar: Joi.string().trim().allow(''),
	gender: Joi.string().only('male', 'female'),
	birthday: Joi.date(),
	country: Joi.string(),
	bio: Joi.string().allow(''),
	token: Joi.string().token()
});

module.exports = userSchema;