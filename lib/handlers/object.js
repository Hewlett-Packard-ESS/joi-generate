'use strict';
var async = require('async');

var ObjectTypeHandler = function(opts) {
	var typeFactory = opts.typeFactory;
	var debug = opts.debug;

	return {
		handle: function(schema, callback) {
			var output = {};
			async.eachSeries(schema._inner.children, function(child, callback) {
				debug('doing child element', child.schema._type);
				var childHandler = typeFactory.gimme(child.schema);
				childHandler.handle(child.schema, function(err, childResult) {
					output[child.key] = childResult;
					callback(err);
				});
			}, function() {
				debug('output', output);
				callback(null, output);
			});
		}
	};
};
module.exports = ObjectTypeHandler;
