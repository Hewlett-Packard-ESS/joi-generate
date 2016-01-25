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
			var output = {};

      // console.log(JSON.stringify(schema));
      onion.handle(output, schema._tests, function(err, output) {
        debug('output', output);
        var potentialSchemas = [];
        
        // For each of the items in the array definition...
        async.eachSeries(schema._inner.items, function(child, callback) {
          // Loop through each of the children of that defintion
          if(child._inner.children) {
            var item = {};
            async.eachSeries(child._inner.children, function(child, cb) {
              debug('doing child element', child.key, child.schema._type);
              item[child.key] = child.schema;
              cb();
            }, function(err) {
              potentialSchemas.push(Joi.object(item));
              item = {};
              callback(err);
            });
          }
          else {
            potentialSchemas.push(child);
            callback();
          }
        }, function(err) {
          if(err) {
            return callback(err, null);
          }
          console.log(output.num);
          var schemaGenerators = new Array(output.num);
          _.fill(schemaGenerators, function(cb){
            var randomSchema = potentialSchemas[_.random(0,potentialSchemas.length - 1)];
            typeFactory.gimme(randomSchema, function(err, childHandler) {
              if(err) {
                return cb(err, null);
              }
              childHandler.handle(randomSchema, function(err, childResult) {
                debug('output', randomSchema.key, childResult);
                cb(err, childResult);
              });
            });
          });

          async.series(schemaGenerators, function(err, output){
            debug('output', output.msg);
            callback(err, output);
          });
        });          
      });
		}
	};
};
module.exports = ArrayTypeHandler;
