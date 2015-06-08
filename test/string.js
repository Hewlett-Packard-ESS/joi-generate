'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
var should = require('should');

describe('String', function() {

	it('should generate a random string', function(done) {
		var schema = Joi.object({
			name: Joi.string()
		});
		generate(schema, function(err, model) {
			model.should.have.properties(['name']);
			model.name.length.should.not.eql(0);
			done();
		});
	});

	it('strings should be able to specify a minimum length', function(done) {
		var schema = Joi.object({
			name: Joi.string().min(200)
		});
		generate(schema, function(err, model) {
			model.should.have.properties(['name']);
			should(model.name.length > 200).eql(true);
			done();
		});
	});

	it('strings should be able to specify a maximum length', function(done) {
		var schema = Joi.object({
			name: Joi.string().max(200)
		});
		generate(schema, function(err, model) {
			model.should.have.properties(['name']);
			should(model.name.length < 200).eql(true);
			done();
		});
	});

	it('strings should be able to specify a minimum and maximum length', function(done) {
		var schema = Joi.object({
			name: Joi.string().min(190).max(200)
		});
		generate(schema, function(err, model) {
			model.should.have.properties(['name']);
			should(model.name.length <= 200 && model.name.length >= 190).eql(true);
			done();
		});
	});

	it('should be able to generate a guid', function(done) {
		var schema = Joi.object({
			name: Joi.string().guid()
		});
		generate(schema, function(err, model) {
			model.should.have.properties(['name']);
			model.name.should.match(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/);
			done();
		});
	});

	it('should be able to generate an ip', function(done) {
		var schema = Joi.object({
			name: Joi.string().ip()
		});
		generate(schema, function(err, model) {
			model.should.have.properties(['name']);
			model.name.should.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
			done();
		});
	});

});
