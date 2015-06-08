'use strict';
var _ = require('lodash');
var Onion = require('lib-onion');

var StringTypeHandler = function(opts) {
	var chance = opts.chance;
	var debug = opts.debug;

	var onion = new Onion('string');

	var Guid = function(msg, tests, next, exit) {
		if (tests.length === 1 && tests[0].name === 'guid') {
			debug('generating a guid');
			return exit(null, chance.guid());
		}
		return next(null, msg, tests);
	};

	var Ip = function(msg, tests, next, exit) {
		if (tests.length === 1 && tests[0].name === 'ip') {
			debug('generating an ip');
			return exit(null, chance.ip());
		}
		return next(null, msg, tests);
	};

	var MinLength = function(msg, tests, next) {
		var min = _.find(tests, {
			name: 'min'
		});
		if (min) {
			min = min.arg;
			if (msg.length >= min) {
				// Message is OK as it is
				return next(null, msg, tests);
			}

			msg = chance.sentence({
				words: min
			});

			var goTo = chance.integer({
				min: min,
				max: min + 50 // Arbitary value
			});
			debug('generating a string of ' + goTo + ' characters');
			msg = msg.substr(0, goTo);
		}
		next(null, msg, tests);
	};

	var MaxLength = function(msg, tests, next) {
		/* jshint maxcomplexity: 6 */
		var max = _.find(tests, {
			name: 'max'
		});
		if (max) {
			max = max.arg;
			if (msg.length <= max) {
				// Message is OK as it is
				return next(null, msg, tests);
			}

			msg = chance.sentence({
				words: max
			});

			var min = _.find(tests, {
				name: 'min'
			});
			if(min) {
				min = min.arg;
			} else {
				min = max / 2;
			}
			var goTo = chance.integer({
				min: min,
				max: max
			});
			debug('generating a string between ' + min + ' and ' + max + ' characters');
			msg = msg.substr(0, goTo);
		}
		return next(null, msg, tests);
	};

	onion.add(Guid, 'guid');
	onion.add(Ip, 'ip');
	onion.add(MinLength, 'min-length');
	onion.add(MaxLength, 'max-length');

	return {
		handle: function(schema, callback) {
			// Start with a random string
			var msg = chance.sentence();
			onion.handle(msg, schema._tests, function(err, output) {
				debug('output', output);
				callback(err, output);
			});
		}
	};
};
module.exports = StringTypeHandler;
