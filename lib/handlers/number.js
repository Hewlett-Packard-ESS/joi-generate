'use strict';
var _ = require('lodash');
var Onion = require('lib-onion');

var NumberTypeHandler = function(opts) {
	var chance = opts.chance;
	var debug = opts.debug;

	var onion = new Onion('number');

	var Min = function(msg, tests, next) {
		var min = _.find(tests, {
			name: 'min'
		});
		if (min) {
			min = min.arg;
			if (msg >= min) {
				// Message is OK as it is
				return next(null, msg, tests);
			}

			msg = chance.integer({
				min: min
			});
		}
		next(null, msg, tests);
	};

	var Max = function(msg, tests, next) {
		/* jshint maxcomplexity: 6 */
		var max = _.find(tests, {
			name: 'max'
		});
		if (max) {
			max = max.arg;
			if (msg <= max) {
				// Message is OK as it is
				return next(null, msg, tests);
			}

			var min = _.find(tests, {
				name: 'min'
			});
			if (min) {
				min = min.arg;
				msg = chance.integer({
					min: min,
					max: max
				});
			} else {
				msg = chance.integer({
					max: max
				});
			}
		}
		return next(null, msg, tests);
	};

	onion.add(Min, 'min');
	onion.add(Max, 'max');

	return {
		handle: function(schema, callback) {
			// Start with a random integer
			var msg = chance.integer();
			onion.handle(msg, schema._tests, function(err, output) {
				debug('output', output);
				callback(err, output);
			});
		}
	};
};
module.exports = NumberTypeHandler;
