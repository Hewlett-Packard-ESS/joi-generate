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
	return Math.floor(Math.random() * 100);
}
module.exports = ArrayTypeHandler;
