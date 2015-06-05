'use strict';
var _ = require('lodash');
var chance = new require('chance').Chance();
var prefix = 'joi:generate:';

var ObjectTypeHandler = function(typeFactory, debug) {
	return {
		handle: function(schema) {
			var output = {};
			_.forEach(schema._inner.children, function(child) {
				debug('doing child element', child.schema._type);
				var childResult = typeFactory.gimme(child.schema);
				output[child.key] = childResult;
				console.log(childResult);
			});
			debug('output', output);
			return output;
		}
	};
};

var StringTypeHandler = function(typeFactory, debug) {
	return {
		handle: function() {
			var output = chance.sentence();
			debug('output', output);
			return output;
		}
	};
};

var TypeFactory = function() {
	var self = {};
	var debug = require('debug')(prefix + 'factory');

	var typeHandlers = {
		object: ObjectTypeHandler,
		string: StringTypeHandler
	};
	(function initHandlers() {
		_.forEach(Object.keys(typeHandlers), function(key) {
			var handlerDebug = require('debug')(prefix + 'handler:' + key);
			typeHandlers[key] = new typeHandlers[key](self, handlerDebug);
		});
	})();

	self.gimme = function(schema) {
		debug('gimme', schema._type);
		var handler = typeHandlers[schema._type];
		if (!handler) {
			throw new Error('No handler has been implemented for ' + schema._type + ' yet.');
		}
		return handler.handle(schema);
	};
	return self;
};

var typeFactory = new TypeFactory();

var Generator = function() {
	var generate = function(schema) {
		return typeFactory.gimme(schema);
	};
	return Object.freeze(generate);
};
module.exports = Generator;
