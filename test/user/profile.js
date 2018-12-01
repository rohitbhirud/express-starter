let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let expect = chai.expect;
let helper = require('../helpers');

const User = require('@app/models/User');

chai.use(chaiHttp);

describe('User Profile', () => {

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
				expect(res.body).to.have.nested.property('data._id');
				done();
			});

	});

	// 2. update user profile
	it('updates user profile info', (done) =>{
			
		chai.request(app)
			.put('/api/v1/profile/' + user.userId)
			.set('content-type', 'application/x-www-form-urlencoded')
			.set('x-access-token', user.token)
			.send({
				username: "joe"
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.have.property('message').that.contains('success');
				expect(res.body).to.have.property('data');
				expect(res.body).to.have.nested.property('data.username');
				expect(res.body).to.have.nested.property('data._id');
				expect(res.body).not.to.have.nested.property('data.password');
				done();
			});

	});

	// 3. error on invalid or missing inputs
	it('expect error on invalid inputs', (done) =>{
			
		chai.request(app)
			.put('/api/v1/profile/' + user.userId)
			.set('content-type', 'application/x-www-form-urlencoded')
			.set('x-access-token', user.token)
			.send({
				lol: "joe"
			})
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res).to.be.json;
				expect(res.body).to.have.property('message').that.contains('not allowed');
				expect(res.body).to.have.property('error');
				done();
			});

	});

});