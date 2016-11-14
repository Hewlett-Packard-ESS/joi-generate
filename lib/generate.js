'use strict';
var _ = require('lodash');
var prefix = 'joi:generate:';
var chance = new require('chance').Chance();

var TypeFactory = function() {
	var self = {};
	var debug = require('debug')(prefix + 'factory');

	var typeHandlers = {
		object: require('./handlers/object'),
		string: require('./handlers/string'),
		array: require('./handlers/array'),
		number: require('./handlers/number'),
		boolean: require('./handlers/boolean'),
		date: require('./handlers/date'),
    any: require('./handlers/any'),
    alternatives: require('./handlers/alternatives')
	};
	(function initHandlers() {
		_.forEach(Object.keys(typeHandlers), function(key) {
			var handlerDebug = require('debug')(prefix + 'handler:' + key);
			typeHandlers[key] = new typeHandlers[key]({
				typeFactory: self,
				debug: handlerDebug,
				chance: chance
			});
		});
	})();

	self.gimme = function(schema, callback) {
		debug('gimme', schema._type);
		var handler = typeHandlers[schema._type];
		if (!handler) {
			return callback(new Error('No handler has been implemented for ' + schema._type + ' yet.'));
		}
		debug('found type handler for', schema._type);
		callback(null, handler);
	};
	return self;
};

var typeFactory = new TypeFactory();

var Generator = function() {
	var generate = function(schema, callback) {
		typeFactory.gimme(schema, function(err, tf) {
			if (err) {
				return callback(err, null);
			}
			tf.handle(schema,function(err, val){
        callback(err,val);
      } );
		});
	};
	return Object.freeze(generate);
};
module.exports = Generator;
