const chai = require('chai'),
	colors = require('colors'),
	expect = chai.expect;

const reporter = require('../lib/reporter');

describe('reporter', () => {
	context('Output via stdout', () => {
		it('should return the title if this is the first time outputting', () => {
			const object = {"title": "Mocha Test", "step": 10, "passed": true};
			const result = reporter.generateString(object);
			expect(result).to.equal('Mocha Test\n'.magenta);
		});

		it('should return the correct output for a pass', () => {
			const object = {"title": "Mocha Test", "step": 10, "passed": true};
			const result = reporter.generateString(object);
			expect(result).to.equal('.'.green);
		});

		it('should return the correct output for a failure', () => {
			const object = {"title": "Mocha Test", "step": 10, "passed": false};
			const result = reporter.generateString(object);
			expect(result).to.equal('F'.red);
		});
	});
});
