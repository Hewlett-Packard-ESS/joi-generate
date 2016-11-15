'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();

describe('Number', function() {

    var go = function(schema, done) {
        generate(schema, function(err, model) {
            if (err) {
                return done(err);
            }
            var error = Joi.validate(model, schema);
            done(error.error);
        });
    };

    it('should generate a random number', function(done) {
        var schema = Joi.object({
            name: Joi.number()
        });
        go(schema, done);
    });

    it('should be able to specify a minimum length', function(done) {
        var schema = Joi.object({
            name: Joi.number().min(200)
        });
        go(schema, done);
    });

    it('should be able to specify a maximum length', function(done) {
        var schema = Joi.object({
            name: Joi.number().max(200)
        });
        go(schema, done);
    });

    it('should be able to specify a minimum and maximum length', function(done) {
        var schema = Joi.object({
            name: Joi.number().min(190).max(200)
        });
        go(schema, done);
    });

    it('should be able to specify a positive', function(done) {
        var schema = Joi.object({
            name: Joi.number().positive()
        });
        go(schema, done);
    });

    it('should be able to specify a negative', function(done) {
        var schema = Joi.object({
            name: Joi.number().negative()
        });
        go(schema, done);
    });

});
