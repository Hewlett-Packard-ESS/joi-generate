'use strict';
var _ = require('lodash');
var ObjectTypeHandler = function(opts) {
	var typeFactory = opts.typeFactory;
	var debug = opts.debug;

	return {
		handle: function(schema) {
			var output = {};
			_.forEach(schema._inner.children, function(child) {
				debug('doing child element', child.schema._type);
				var childResult = typeFactory.gimme(child.schema);
				output[child.key] = childResult;
			});
			debug('output', output);
			return output;
		}
	};
};
module.exports = ObjectTypeHandler;
