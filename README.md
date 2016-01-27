[![Build Status](https://travis-ci.org/Varedis/spectre-test-runner.svg?branch=master)](https://travis-ci.org/Varedis/spectre-test-runner)

# Description

The Spectre test runner is a node script that will run Spectre style tests against your frontend code.

# Spectre style tests?

Spectre style tests are simple JSON files that include a list of steps to run, this spec file is then used to generate a full blown CasperJS test, meaning that you can create frontend tests quickly and easily without having to write tedious test type code.

A typical Spectre test would look something like this, this is a working sample and can be run using Spectre:

	{
		"url": "https://en.wikipedia.org/wiki/Main_Page",
		"title": "Wikipedia example",
		"steps": [
			{
				"action": "fillSelectors",
				"value": "Spectre",
				"selector": "#searchInput",
				"order": 10
			},
			{
				"action": "click",
				"selector": "#searchButton",
				"order": 20
			},
			{
				"action": "assertSelectorHasText",
				"selector": "#mw-content-text",
				"value": "Spectre or specter usually refers to a ghost or other apparition.",
				"order": 30
			}
		]
	}

This test will open wikipedia, enter a search term of "Spectre" and click the search button, we will then assert that the correct text is shown on the page.

The output of this test in the terminal looks like this:

	Wikipedia example
	...
	3 steps total, 3 passed, 0 failed

Stay tuned to the [Spectre](https://github.com/Varedis/Spectre) repo, for a cool web app that will allow you to create these Spectre files using an easy interface.

# Prerequisites

In order for the tests to run successfully, you need to globally install the following modules:

* PhantomJS `npm install -g phantomjs`
* CasperJS `npm install -g casperjs`

If you are having trouble, you may be missing prerequisites for either PhantomJS or CasperJS, you can find a list of CasperJS prerequisites [here](http://docs.casperjs.org/en/latest/installation.html#prerequisites)

# TODO list

The following list is in the priority order of things that are still on the the TODO list:

* Step failures actually log some useful information so you can see where your script failed and why.
* Testing against more inbuilt Casperjs actions and asserts.
* Ability to have steps that export a variable for use in later steps.
* Running multiple tests at once (i.e. just running `spectre` runs all your tests).
* Command line and file based config for options.
* Ability to watch files for changes and automatically rerun tests.
