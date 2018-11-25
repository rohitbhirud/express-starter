let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let expect = chai.expect;

const User = require('@app/models/User');

chai.use(chaiHttp);


describe('User register', () => {

	before(function(done) {
		User.deleteMany({}, err => {
			if (err) console.log(err);
		});

		done();
	});

	after(function(done) {
		User.deleteMany({}, err => {
			if (err) console.log(err);
		});

		done();
	});

	describe('Register success', () => {
		// 1. success registration
		it('expects user to register successfully', (done) =>{
				
			chai.request(app)
				.post('/auth/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send({
					'email': 'rohit@gmail.com',
					'password': '111111'
				})
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.include({ message: 'User created!' });
					done();
				});

		});
	});

	describe('Register fail', () => {
		// 2. fail on missing info
		it('expects errors on missing credentials', (done) => {

			chai.request(app)
				.post('/auth/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send({
					'email': '',
					'password': '11111'
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.have.property('message').that.contains('Email');
					done();
				});

		});

		// 3. fail on duplicate email
		it('expects errors on duplicate email', (done) => {

			chai.request(app)
				.post('/auth/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send({
					'email': 'rohit@gmail.com',
					'password': '123456'
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.include({ "message": "User already exists" });
					done();
				});

		});
		
		// 4. info validation tests
		it('expect errors on invalid credentials', (done) => {
			chai.request(app)
				.post('/auth/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send({
					'email': 'rohitgmail.com',
					'password': '123456'
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res).to.be.json;
					expect(res.body).to.have.property('message').that.contains('valid email');
					done();
				});
		});
	});
	

});