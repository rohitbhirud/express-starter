let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');

const getLoggedInUser = () => {
	const email = 'rohit@gmail.com',
		password = '111111';

	let user;

	return new Promise((resolve, reject) => {

		chai.request(app)
			.post('/auth/login')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				'email': email,
				'password': password
			})
			.end((err, res) => {
				resolve(res.body.data);
			});
	});
}
module.exports = {
	getLoggedInUser
}