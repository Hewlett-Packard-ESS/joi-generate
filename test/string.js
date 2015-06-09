'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();

describe('String', function() {

	var go = function(schema, done) {
		generate(schema, function(err, model) {
			if(err) {
				return done(err);
			}
			var error = Joi.validate(model, schema);
			done(error.error);
		});
	};

	it('should generate a random string', function(done) {
		var schema = Joi.object({
			name: Joi.string()
		});
		go(schema, done);
	});

	it('strings should be able to specify a minimum length', function(done) {
		var schema = Joi.object({
			name: Joi.string().min(200)
		});
		go(schema, done);
	});

	it('strings should be able to specify a maximum length', function(done) {
		var schema = Joi.object({
			name: Joi.string().max(200)
		});
		go(schema, done);
	});

	it('strings should be able to specify a minimum and maximum length', function(done) {
		var schema = Joi.object({
			name: Joi.string().min(190).max(200)
		});
		go(schema, done);
	});

	it('should be able to generate an email', function(done) {
		var schema = Joi.object({
			name: Joi.string().email()
		});
		go(schema, done);
	});

	it('should be able to generate a guid', function(done) {
		var schema = Joi.object({
			name: Joi.string().guid()
		});
		go(schema, done);
	});

	it('should be able to generate an ip', function(done) {
		var schema = Joi.object({
			name: Joi.string().ip()
		});
		go(schema, done);
	});

	it('should be able to generate a hostname', function(done) {
		var schema = Joi.object({
			name: Joi.string().hostname()
		});
		go(schema, done);
	});
});
