'use strict';
var _ = require('lodash');

var StringTypeHandler = function(opts) {
	var chance = opts.chance;
	var debug = opts.debug;

	// Returns the chance generator to use
	// depending on the _tests object
	var GeneratorFactory = function() {
		var self = {};
		var IsGuid = function() {
			var self = {};
			self.test = function(tests) {
				return (tests.length === 1 && tests[0].name === 'guid');
			};
			self.generator = 'guid';
			return self;
		};

		self.gimme = function(tests) {
			var toggles = [new IsGuid()];
			var generator = 'sentence';

			_.forEach(toggles, function(toggle) {
				if (toggle.test(tests)) {
					generator = toggle.generator;
				}
			});
			return generator;
		};
		return self;
	};
	var generatorFactory = new GeneratorFactory();

	// Returns the chance generator options to use
	// depending on the _tests object
	var GeneratorOptionsFactory = function() {
		var self = {};

		var MinLength = function() {
			var self = {};
			self.options = function(tests) {
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
			self.test = function(tests) {
				return (_.find(tests, {
					name: 'min'
				}) !== undefined);
			};
			return self;
		};

		self.gimme = function(tests) {
			var toggles = [new MinLength()];
			var options = {};

			_.forEach(toggles, function(toggle) {
				if (toggle.test(tests)) {
					options = toggle.options(tests);
				}
			});
			return options;
		};
		return self;
	};
	var generatorOptionsFactory = new GeneratorOptionsFactory();


	// These are kind of post processing filters
	var PostProcessor = function() {
		var self = {};

		var MaxLength = function() {
			var self = {};
			self.test = function(tests) {
				return (_.find(tests, {
					name: 'max'
				}) !== undefined);
			};
			self.handle = function(tests, output) {
				// If we have a max specified, pick some amount between min and max
				var min = _.find(tests, {
					name: 'min'
				});
				var max = _.find(tests, {
					name: 'max'
				}).arg;

				if (min) {
					min = min.arg;
				} else {
					min = 0;
				}
				// Get a random value between these two
				var goTo = chance.integer({
					min: min,
					max: max
				});
				return output.substr(0, goTo);
			};
			return self;
		};

		self.handle = function(tests, output) {
			var filters = [new MaxLength()];
			_.forEach(filters, function(filter) {
				if (filter.test(tests)) {
					output = filter.handle(tests, output);
				}
			});
			return output;
		};
		return self;
	};
	var postProcessor = new PostProcessor();

	return {
		handle: function(schema) {
			var tests = schema._tests;
			var generator = generatorFactory.gimme(tests);
			var generatorOptions = generatorOptionsFactory.gimme(tests);

			var output = chance[generator](generatorOptions);
			output = postProcessor.handle(tests, output);

			debug('output', output);
			return output;
		}
	};
};
module.exports = StringTypeHandler;
