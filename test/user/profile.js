let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let expect = chai.expect;
let helper = require('../helpers');

const User = require('@app/models/User');

chai.use(chaiHttp);

describe('User login', () => {

	let user = {};

	before((done) => {
		// login user with jwt token
		helper.getLoggedInUser().then((data) => {
			user = data;
			done();
		})
		.catch((err) => {
			throw err;
			done();
		});
	});

	// 1. get user  profile info
	// get user profile info
	it('get user profile info', (done) =>{
			
		chai.request(app)
			.get('/api/v1/profile/' + user.userId)
			.set('content-type', 'application/x-www-form-urlencoded')
			.set('x-access-token', user.token)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.have.property('message').that.contains('success');
				expect(res.body).to.have.property('data');
				expect(res.body).to.have.nested.property('data.profile');
				expect(res.body).to.have.nested.property('data._id');
				done();
			});

	});
	// 2. error on invalid token
	// 3. error on missing token
	// 4. update user profile
	// 5. update user with limited info
	// 6. validate user info
	// 7. error on invalid or missing inputs

});