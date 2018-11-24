let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app');
let expect = chai.expect;

chai.use(chaiHttp);

describe('User register', () => {

	describe('Register success', () => {
		// 1. success registration
		it('expects user to register successfully', (done) =>{
				
			chai.request(app)
				.post('/auth/register')
				.set('content-type', 'application/x-www-form-urlencoded')
				.send({
					'email': 'rbhirud7@gmail.com',
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
					expect(res).to.have.status(401);
					expect(res).to.be.json;
					expect(res.body).to.include({ "error": "Unauthorized" });
					done();
				});

		});

		// 3. fail on duplicate email
	});
	
	// 4. info validation tests





});