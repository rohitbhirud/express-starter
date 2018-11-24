process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
let should = chai.should();

chai.use(chaiHttp);

describe('App Level', () => {

	describe('Basic Routes', () => {

		it('it should get homepage', (done) => {
	
			chai.request(app)
				.get('/')
				.end((err, res) => {
					res.should.have.status(200);
				
					done();
				});

		});

	});

});