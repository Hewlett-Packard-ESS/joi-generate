'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
require('should');

describe('Object', function() {

	it('should generate an object', function(done) {
		var schema = Joi.object({});
		generate(schema, function(err, model) {
			var error = Joi.validate(model, schema);
			done(error.error);
		});
	});

});
