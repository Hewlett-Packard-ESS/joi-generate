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
				typeFactory.gimme(child.schema, function(err, childHandler) {
					if(err) {
						return callback(err);
					}
					childHandler.handle(child.schema, function(err, childResult) {
						output[child.key] = childResult;
						callback(err);
					});
				});
			}, function(err) {
				debug('output', output);
				callback(err, output);
			});
		}
	};
};
module.exports = ObjectTypeHandler;
