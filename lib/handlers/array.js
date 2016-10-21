'use strict';
var _ = require('lodash');
var Joi = require('joi');
var async = require('async');
var Onion = require('lib-onion');

var ArrayTypeHandler = function(opts) {
	var typeFactory = opts.typeFactory;
  var chance = opts.chance;
  var debug = opts.debug;

  var onion = new Onion('array');

  var Min = function(msg, tests, next) {
    var min = _.find(tests, {
      name: 'min'
    });
    if (min) {
      min = min.arg;
      if (msg.num >= min) {
        // Message is OK as it is
        return next(null, msg, tests);
      }

      msg.num = chance.integer({
        min: min,
        max: 100
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
      if (msg.num <= max) {
        // Message is OK as it is
        return next(null, msg, tests);
      }

      var min = _.find(tests, {
        name: 'min'
      });
      if (min) {
        min = min.arg;
        msg.num = chance.integer({
          min: min,
          max: max
        });
      } else {
        msg.num = chance.integer({
          min: 0,
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
			var output = [];

			// For each of the items in the array definition...
			async.eachSeries(schema._inner.items, function(child, callback) {
				var item = {};
				// Loop through each of the children of that definition if they exist
				if (child._inner.children) {
					async.eachSeries(child._inner.children, function (child, callback) {
						debug('doing child element', child.key, child.schema._type);
						typeFactory.gimme(child.schema, function (err, childHandler) {
							if (err) {
								return callback(err, null);
							}
							
							async.times(random(), function(n, callback) {
								childHandler.handle(child.schema, function (err, childResult) {
									item[child.key] = childResult;
									debug('output', child.key, childResult);
									callback(err);
								});
							}, callback);
							
						});
					}, function (err) {
						output.push(item);
						item = {};
						callback(err);
					});
				}
				
				// else generate the type directly in it
				else {
					typeFactory.gimme(child, function (err, childHandler) {
						if (err)
							return callback(err, null);
						
						async.times(random(), function(n, callback) {
							childHandler.handle(child, function (err, childResult) {
								output.push(childResult);
								callback(err);
							})
						}, callback);
						
					});
				}
				
			}, function(err) {
				debug('output', output);
				callback(err, output);
			});
		}
	};
};

function random() {
	return Math.ceil(Math.random() * 100);
}
module.exports = ArrayTypeHandler;
