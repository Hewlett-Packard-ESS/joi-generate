'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
var should = require('should');

describe('String', function() {

	it('should generate a random string', function() {
		var schema = Joi.object({
			name: Joi.string()
		});
		var model = generate(schema);
		model.should.have.properties(['name']);
		model.name.length.should.not.eql(0);
	});

	it('strings should be able to specify a minimum length', function() {
		var schema = Joi.object({
			name: Joi.string().min(200)
		});
		var model = generate(schema);
		model.should.have.properties(['name']);
		should(model.name.length > 200).eql(true);
	});

	it('strings should be able to specify a maximum length', function() {
		var schema = Joi.object({
			name: Joi.string().max(200)
		});
		var model = generate(schema);
		model.should.have.properties(['name']);
		should(model.name.length < 200).eql(true);
	});

	it('strings should be able to specify a minimum and maximum length', function() {
		var schema = Joi.object({
			name: Joi.string().min(190).max(200)
		});
		var model = generate(schema);
		model.should.have.properties(['name']);
		should(model.name.length <= 200 && model.name.length >= 190).eql(true);
	});

});
