let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let expect = chai.expect;
let helper = require('../helpers');

chai.use(chaiHttp);

describe('JWT Token', () => {

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

	// 1. success on valid token
	it('expects success on valid token', (done) =>{
			
		chai.request(app)
			.get('/api/v1/profile/' + user.userId)
			.set('content-type', 'application/x-www-form-urlencoded')
			.set('x-access-token', user.token)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.have.property('message').that.contains('success');;
				done();
			});

	});

	// 2. error on invalid token
	it('expects error on invalid token', (done) =>{
			
		chai.request(app)
			.get('/api/v1/profile/' + user.userId)
			.set('content-type', 'application/x-www-form-urlencoded')
			.set('x-access-token', "kdfksdkfsdfdfskkdfdsdsnf")
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res).to.be.json;
				expect(res.body).to.have.property('error').that.contains('Unauthorized');
				expect(res.body).to.have.property('message').that.contains('Invalid token');;
				done();
			});

	});

	// 3. error on missing token
	it('expects error on missing token', (done) =>{
			
		chai.request(app)
			.get('/api/v1/profile/' + user.userId)
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res).to.be.json;
				expect(res.body).to.have.property('error').that.contains('Unauthorized');
				expect(res.body).to.have.property('message').that.contains('No token provided');;
				done();
			});

	});

});