'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
require('should');

describe('Array', function() {

	it('should generate an array', function(done) {
		var schema = Joi.object({
			items: Joi.array().required().items(Joi.object({
				name: Joi.string()	
			}))
		});
		generate(schema, function(err, model) {
			var error = Joi.validate(model, schema);
			done(error.error);
		});
	});

	it('should handle arrays with multiple objects', function(done) {
		var schema = Joi.object({
			items: Joi.array().required().items(Joi.object({
				name: Joi.string(),
				host: Joi.string().ip(),
				domain: Joi.string().ip()
			}))
		});
		generate(schema, function(err, model) {
			var error = Joi.validate(model, schema);
			done(error.error);
		});
	});

});
