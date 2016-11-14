'use strict';
var Joi = require('joi');
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
