'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
require('should');

describe('String', function() {

	it('should generate a random string', function() {
		var schema = Joi.object({
			name: Joi.string()
		});
		var model = generate(schema);
		console.log(model);
		model.should.have.properties(['name']);
		model.name.length.should.not.eql(0);
	});

});
