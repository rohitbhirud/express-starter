let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let expect = chai.expect;

const User = require('@app/models/User');

chai.use(chaiHttp);

describe('User login', () => {

	before(function(done) {

		// create user before logging in
		const userCreds = {
			email: 'rohit@gmail.com',
			password: '111111'
		}
		
		let user = new User(userCreds)
		user.save();

		done();
	});


	// 1. success registration
	it('expects user to login successfully', (done) =>{
			
		chai.request(app)
			.post('/auth/login')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				'email': 'rohit@gmail.com',
				'password': '111111'
			})
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.have.property('message');
				expect(res.body).to.have.nested.property('data.userId');
				expect(res.body).to.have.nested.property('data.email');
				expect(res.body).to.have.nested.property('data.token');
				done();
			});

	});


	// 2. error on invalid creds
	it('expects errors on invalid creds', (done) =>{
			
		chai.request(app)
			.post('/auth/login')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				'email': 'rohit@google.com',
				'password': '111111'
			})
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res).to.be.json;
				expect(res.body).to.have.property('error').that.contains('Unauthorized');
				expect(res.body).to.have.property('message').that.contains('Incorrect email or password.');
				done();
			});

	});

	// 3. error on missing creds
	it('expects errors on missing creds', (done) =>{
			
		chai.request(app)
			.post('/auth/login')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				'password': '111111'
			})
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res).to.be.json;
				expect(res.body).to.have.property('error').that.contains('Unauthorized');
				expect(res.body).to.have.property('message').that.contains('Missing credentials');
				done();
			});

	});
});