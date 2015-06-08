'use strict';
var async = require('async');

var ArrayTypeHandler = function(opts) {
	var typeFactory = opts.typeFactory;
	var debug = opts.debug;

	return {
		handle: function(schema, callback) {
			var output = [];

			// For each of the items in the array definition...
			async.eachSeries(schema._inner.items, function(child, callback) {
				var item = {};
				// Loop through each of the children of that defintion
				async.eachSeries(child._inner.children, function(child, callback) {
					debug('doing child element', child.schema._type);
					typeFactory.gimme(child.schema, function(err, childHandler) {
						if(err) {
							return callback(err, null);
						}
						childHandler.handle(child.schema, function(err, childResult) {
							item[child.key] = childResult;
							callback(err);
						});
					});
				}, function(err) {
					output.push(item);
					item = {};
					callback(err);
				});
			}, function(err) {
				debug('output', output);
				callback(err, output);
			});
		}
	};
};
module.exports = ArrayTypeHandler;
