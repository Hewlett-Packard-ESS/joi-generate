'use strict';
var DateTypeHandler = function(opts) {
	var chance = opts.chance;

	return {
		handle: function(schema, callback) {
			var msg = chance.date();
			callback(null, msg);
		}
	};
};
module.exports = DateTypeHandler;
