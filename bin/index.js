#! /usr/bin/env node

'use strict';

const Bluebird = require('bluebird'),
	colors = require('colors'),
	spawn = require('child_process').spawn,
	fs = require('fs');

const generator = require('../lib/generator'),
	reporter = require('../lib/reporter'),
	utils = require('../lib/utils');

Bluebird.promisifyAll(fs);

var opts = {
	specLocation: 'spec'
}

// TODO: Better user arguments using something like commander (https://www.npmjs.com/package/commander)
const userArgs = process.argv.slice(2);
var filesToRun = [];
if (!userArgs.length) {
	// TODO: Get all files
} else {
	filesToRun.push(userArgs[0]);
}

if (!filesToRun) {
	throw new Error("Couldn't find any spec files to run.");
}

var madeTempDir = false;

return filesToRun.forEach(specFile => {
	var dir = './' + opts.specLocation + '/tmp/';
	if (!fs.existsSync(dir)) {
		madeTempDir = true;
	    fs.mkdirSync(dir);
	}

	return fs.readFileAsync(specFile)
		.then(contents => JSON.parse(contents))
		.then(spec => {

			return generator.generate(specFile)
				.then(script => {
					// Generate temporary file here
					fs.writeFileAsync(dir + 'run.js', script)
						.then(err => {
							if (err) {
								console.error(err);
								return;
							}

							const stepCount = spec.steps.length;

							let passedCount = 0,
								failedCount = 0,
								isFirstStep = true;

							var args = ['test'].concat(dir + 'run.js');

							const child = spawn('casperjs', args);
							child.stdout.on('data', function (message) {
								const msgStrings = utils.parseString(message.toString());
								msgStrings.forEach(msg => {
									if (utils.isJSON(msg.toString())) {
										const output = JSON.parse(msg);
										if (output.passed === true) {
											passedCount++;
										}

										if (output.passed === false) {
											failedCount++;
										}

										reporter.outputString(output);

										// TODO: Log first failure message
									}
								});
							});

							child.stderr.on('data', function (msg) {
								process.stderr.write(msg);
							});

							child.on('exit', function (code) {
								var outputString = `\n${stepCount} steps total, ${passedCount} passed, ${failedCount} failed\n`;
								if (stepCount === passedCount) {
									outputString = outputString.green;
								} else {
									outputString = outputString.yellow;
								}
								process.stdout.write(outputString)

								// Clean file in here
								return fs.unlinkAsync(dir + 'run.js')
									.then(() => {
										if (madeTempDir) {
											return fs.rmdirAsync(dir);
										}
									});
							});
						});
				});
		});
});
