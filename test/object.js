'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
require('should');

describe('Object', function() {

	it('should generate an object', function() {
		var schema = Joi.object({});
		var model = generate(schema);
		model.should.eql({});
	});

});
