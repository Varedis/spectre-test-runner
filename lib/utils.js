const _ = require('lodash');

var isFirstStep = true;

module.exports = {
	isJSON(str) {
		try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }

		return true;
	},
	parseString(str) {
		if (_.isString(str)) {
			return str.split("\n");
		}

		return [];
	}
};
