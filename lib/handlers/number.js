'use strict';
var _ = require('lodash');
var Onion = require('lib-onion');

var NumberTypeHandler = function(opts) {
	var chance = opts.chance;
	var debug = opts.debug;

	var onion = new Onion('number');

  var Min = function(tests, chanceParams, next) {
    var minimum = _.find(tests, {
      name: 'min'
    });
    if(minimum){
      minimum = minimum.arg;
      chanceParams.min = chanceParams.min ? _.max(chanceParams.min, minimum) : minimum;
    }
    next(null, tests, chanceParams);
  };

  var Positive = function(tests, chanceParams, next) {
    var positive = _.find(tests, {
      name: 'positive'
    });
    if(positive){
      positive = positive.arg;
      chanceParams.min = chanceParams.min ? _.max(chanceParams.min, 0) : 0;
    }
    next(null, tests,chanceParams);
  };

  var Max = function(tests, chanceParams, next) {
    var maximum = _.find(tests, {
      name: 'max'
    });
    if(maximum){
      maximum = maximum.arg;
      chanceParams.max = chanceParams.max ? _.min(chanceParams.max, maximum) : maximum;
    }
    next(null, tests, chanceParams);
  };

  var Negative = function(tests, chanceParams, next) {
    var negative = _.find(tests, {
      name: 'negative'
    });
    if(negative){
      negative = negative.arg;
      chanceParams.max = chanceParams.max ? _.max(chanceParams.max, 0) : 0;
    }
    next(null, tests,chanceParams);
  };

  onion.add(Min, 'min');
  onion.add(Max, 'max');
  onion.add(Positive, 'positive');
  onion.add(Negative, 'negative');

	return {
		handle: function(schema, callback) {
			// Start with a random integer
			var msg = chance.integer({min: 0, max: 1471465258458});
			onion.handle(msg, schema._tests, function(err, output) {
				debug('output', output);
				callback(err, output);
			});
		}
	};
};
module.exports = NumberTypeHandler;
