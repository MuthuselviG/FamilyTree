const chai = require('chai')
require('mocha-sinon');
const expect = chai.expect

const geekTrust = require('../src/geektrust.js')

describe("Test Family Tree", () => {

	beforeEach(function () {
		this.sinon.stub(console, 'log');
	});

	it("should return ERROR_READING_FILE when the file is not valid", () => {
		geekTrust.start("../test/test.txt");
		expect(console.log.calledOnce).to.be.true;
		//expect(console.log.calledWith('ERROR_READING_FILE')).to.be.true;
	})
})