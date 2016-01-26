const chai = require('chai'),
	expect = chai.expect;

const utils = require('../lib/utils');

describe('utils', () => {
	context('check if string is JSON', () => {
		it('should return true for valid JSON string', () => {
			const string = '{"title": "Mocha Test", "step": 10, "passed": true}';
			expect(utils.isJSON(string)).to.be.true;
		});

		it('should return false for invalid JSON string', () => {
			const string = 'This is not JSON';
			expect(utils.isJSON(string)).to.be.false;
		});
	});

	context('parse string', () => {
		it('returns an array of strings broken by newlines', () => {
			const string = 'Some text \n{"title": "Mocha Test", "step": 10, "passed": true}';
			const result = utils.parseString(string);
			expect(result).to.be.an('array');
			expect(result).to.have.length(2);
			expect(result[0]).to.equal('Some text ');
			expect(result[1]).to.equal('{"title": "Mocha Test", "step": 10, "passed": true}');
		});

		it('return an array of one item if no newline', () => {
			const string = '{"title": "Mocha Test", "step": 10, "passed": true}';
			const result = utils.parseString(string);
			expect(result).to.be.an('array');
			expect(result).to.have.length(1);
			expect(result[0]).to.equal('{"title": "Mocha Test", "step": 10, "passed": true}');
		});

		it('returns an empty array if the item passed in is not a string', () => {
			const result = utils.parseString(null);
			expect(result).to.be.an('array');
			expect(result).to.have.length(0);
		});
	});
});
