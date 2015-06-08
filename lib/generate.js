'use strict';
var _ = require('lodash');
var prefix = 'joi:generate:';
var chance = new require('chance').Chance();

var TypeFactory = function() {
	var self = {};
	var debug = require('debug')(prefix + 'factory');

	var typeHandlers = {
		object: require('./handlers/object'),
		string: require('./handlers/string')
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

	self.gimme = function(schema) {
		debug('gimme', schema._type);
		var handler = typeHandlers[schema._type];
		if (!handler) {
			throw new Error('No handler has been implemented for ' + schema._type + ' yet.');
		} 
		debug('found type handler for', schema._type);
		return handler;
	};
	return self;
};

var typeFactory = new TypeFactory();

var Generator = function() {
	var generate = function(schema, callback) {
		var tf = typeFactory.gimme(schema);
		tf.handle(schema, callback);
	};
	return Object.freeze(generate);
};
module.exports = Generator;
