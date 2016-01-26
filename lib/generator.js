const Bluebird = require('bluebird'),
	sortBy = require('sort-by'),
	fs = require('fs');

Bluebird.promisifyAll(fs);

module.exports = {
	isAssertStep(action) {
		if (action.match(/^assert/i)) {
			return true;
		}

		return false;
	},

	resolveValueForAction(action, value, selector) {
		if (action === 'fillSelectors') {
			var obj = {};
			obj[selector] = value;
			return JSON.stringify(obj);
		}
		if(action === 'assertEval') {
			return `function () { ${value} }`;
		}

		return `'${value}'`;
	},

	resolveSelectorForAction(action, selector) {
		if (action === 'fillSelectors') {
			return `casper.evaluate(function (selector) {
				var formObject = document.querySelector(selector).form;
				if (formObject.getAttribute('id')) {
					return '#' + formObject.getAttribute('id');
				}

				// TODO: Other methods of identifying a form here

				return 'form';
			}, '${selector}')`;
		}

		return `'${selector}'`;
	},

	resolveAction(action) {
		return action;
	},

	performAction(processor, action, value, selector) {
		action = this.resolveAction(action);

		if (selector && value) {
			return `${processor}.${action}(${selector}, ${value});`;
		}
		if (value) {
			return `${processor}.${action}(${value});`;
		}
		if (selector) {
			return `${processor}.${action}(${selector});`;
		}

		throw new Error('Step did not contain either a value or a selector');
	},

	performStep(title, step, action, value, selector, supressLog) {
		kebabTitle = title.replace(' ', '-').toLowerCase();
		selector = selector || null;
		value = value || null;
		action = action || null;
		supressLog = supressLog || false;

		if (value) {
			value = this.resolveValueForAction(action, value, selector);
		}
		if (selector) {
			selector = this.resolveSelectorForAction(action, selector);
		}

		var processor = `casper`;
		if (this.isAssertStep(action)) {
			processor = `test`;
		}

		var output = ``;
		output += `try {`;
			output += this.performAction(processor, action, value, selector);
			if (!supressLog) {
				output += `casper.echo('{"title": "${title}", "step": "${step}", "passed": true}');`;
			}
			output += `casper.capture('./images/${kebabTitle}-${step}.png')`;
		output += `} catch(err) {`;
			if (!supressLog) {
				output += `casper.echo('{"title": "${title}", "step": "${step}", "passed": false}');`;
			}
			output += `throw output;`;
		output += `}`;

		return output;
	},

	performPostStep(title, order, action, value, selector) {
		var string = ``;

		if (action === 'fillSelectors') {
			string += `casper.then(function () {`;
			string += this.performStep(title, order, 'click', value, selector, true);
			string += `});`;
		}

		return string;
	},

	countAsserts(steps) {
		return steps.filter(step => this.isAssertStep(step.action)).length;
	},

	generate(specFile) {
		return fs.readFileAsync(specFile)
			.then(contents => JSON.parse(contents))
			.then(spec => {
				const assertCount = this.countAsserts(spec.steps);

				var string = `casper.test.begin('${spec.title}', ${assertCount}, function suite(test) {
					casper.start('${spec.url}');`;

				spec.steps
					.sort(sortBy('order'))
					.map(step => {
						string += `casper.then(function () {`;
						string += this.performStep(spec.title, step.order, step.action, step.value, step.selector);
						string += `});`;
						string += this.performPostStep(spec.title, step.order, step.action, step.value, step.selector);
					});

				string += `casper.run(function () {
						test.done();
					});
				});`;

				return string;
			});
	}

};
