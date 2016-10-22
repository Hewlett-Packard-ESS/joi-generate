'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
require('should');

describe('Object', function() {

  it('should generate a binary', function(done) {
    var schema = Joi.object({
      file: Joi.binary()
    });
    generate(schema, function(err, model) {
      if (err) {
        return done(err);
      }

      var error = Joi.validate(model, schema);
      done(error.error);
    });
  });

  it('should generate an ascii encoded binary', function(done) {
    var schema = Joi.object({
      file: Joi.binary().encoding('ascii')
    });
    generate(schema, function(err, model) {
      if (err) {
        return done(err);
      }

      var error = Joi.validate(model, schema);
      done(error.error);
    });
  });

  it('should generate a binary with minimum', function(done) {
    var schema = Joi.object({
      file: Joi.binary().min(10)
    });
    generate(schema, function(err, model) {
      if (err) {
        return done(err);
      }

      var error = Joi.validate(model, schema);
      done(error.error);
    });
  });

  it('should generate a binary with maximum', function(done) {
    var schema = Joi.object({
      file: Joi.binary().max(4)
    });
    generate(schema, function(err, model) {
      if (err) {
        return done(err);
      }

      var error = Joi.validate(model, schema);
      done(error.error);
    });
  });

});
