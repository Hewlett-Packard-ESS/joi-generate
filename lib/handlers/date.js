'use strict';
var moment = require('moment');

var DateTypeHandler = function(opts) {
	var chance = opts.chance;

	return {
		handle: function(schema, callback) {
			/* jshint maxcomplexity: 5 */
			var format = null;
			if (schema._flags && schema._flags.format) {
				format = schema._flags.format;
			}
			var msg = chance.date();
			if (format !== null) {
				// Format of RegExp is caused by date().iso()
				if (format instanceof RegExp) {
					msg = moment(msg).format();
				} else {
					msg = moment(msg).format(format);
				}
			}
			callback(null, msg);
		}
	};
};
module.exports = DateTypeHandler;
