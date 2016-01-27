const colors = require('colors');

var isFirstStep = true;

// TODO: Multiple reporters
module.exports = {
	generateString(output) {
		if (isFirstStep) {
			// Output the test name
			isFirstStep = false;
			return `${output.title}\n`.magenta;
		}

		if (output.passed === true) {
			return `.`.green;
		}
		if (output.passed === false) {
			return `F`.red;
		}
	},
	outputString(output) {
		if (isFirstStep) {
			process.stdout.write(this.generateString(output));
		}
		process.stdout.write(this.generateString(output));
	}
};
