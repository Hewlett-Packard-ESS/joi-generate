'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
require('should');

describe('Object', function() {

	it('should generate an object w/ alternatives', function(done) {
		var schema = Joi.object({data:[Joi.number(),Joi.string().max(2)]});
		generate(schema, function(err, model) {
			if (err) {
				return done(err);
			}

			var error = Joi.validate(model, schema);
			done(error.error);
		});
	});

});
