'use strict';
var Joi = require('joi');
var async = require('async');
var generate = new require('../').Generate();
require('should');

describe('Array', function() {

	var go = function(schema, done) {
		generate(schema, function(err, model) {
			if (err) {
				return done(err);
			}
			var error = Joi.validate(model, schema);
			done(error.error);
		});
	};

	it('should generate an array', function(done) {
		var schema = Joi.object({
			items: Joi.array().required().items(Joi.object({
				name: Joi.string()
			}))
		});
		go(schema, done);
	});

	it('should handle arrays with multiple objects', function(done) {
		var schema = Joi.object({
			items: Joi.array().required().items(Joi.object({
				name: Joi.string(),
				host: Joi.string().ip(),
				domain: Joi.string().ip()
			}))
		});
		go(schema, done);
	});
	
	it('should populate an array with matching items', function(done) {
		var types = [Joi.string(), Joi.boolean(), Joi.number(), Joi.date()];
		
		async.each(types, function(type, callback) {
			var schema = Joi.array().required().items(type);

			go(schema, callback);
		}, done);
		
	});

	it('should handle arrays with min objects', function(done) {
		var schema = Joi.object({
			items: Joi.array().required().items(Joi.object({
				name: Joi.string()
			})).min(3)
		});
		go(schema, done);
	});

	it('should handle arrays with max objects', function(done) {
		var schema = Joi.object({
			items: Joi.array().required().items(Joi.object({
				name: Joi.string()
			})).max(3)
		});
		go(schema, done);
	});

		it('should handle arrays with min and max objects', function(done) {
		var schema = Joi.object({
			items: Joi.array().required().items(Joi.object({
				name: Joi.string()
			})).min(2).max(2)
		});
		go(schema, done);
	});
});
