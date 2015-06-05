'use strict';
var _ = require('lodash');

var StringTypeHandler = function(opts) {
	var chance = opts.chance;
	var debug = opts.debug;

	var testsToChanceOptions = function(tests) {
		var chanceOptions = {};
		var options = {
			min: function(arg) {
				chanceOptions.words = arg / 2;
			}
		};

		var handleTest = function(test) {
			if (options[test.name]) {
				options[test.name](test.arg);
			}
		};
		_.forEach(tests, handleTest);
		return chanceOptions;
	};

	var testToChanceFilters = function(tests, output) {
		var options = {
			max: function(arg) {
				// If we have a max specified, pick some amount between min and max
				var min = 0;
				var find = _.find(tests, {
					name: 'min'
				});
				if(find) {
					min = find.arg;
				};
				// Get a random value between these two
				var goTo = chance.integer({ min: min, max: arg });
				return output.substr(0, goTo);
			}
		};
		var handleTest = function(test) {
			if (options[test.name]) {
				output = options[test.name](test.arg);
			}
		};
		_.forEach(tests, handleTest);
		return output;
	};

	return {
		handle: function(schema) {
			var output = chance.sentence(testsToChanceOptions(schema._tests));
			output = testToChanceFilters(schema._tests, output);

			debug('output', output);
			return output;
		}
	};
};
module.exports = StringTypeHandler;
