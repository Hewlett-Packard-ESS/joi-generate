'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();

describe('Date', function() {

    var go = function(schema, done) {
        generate(schema, function(err, model) {
            if (err) {
                return done(err);
            }
            var error = Joi.validate(model, schema);
            done(error.error);
        });
    };

    it('should generate a date value', function(done) {
        var schema = Joi.object({
            name: Joi.date()
        });
        go(schema, done);
    });

    it('should handle custom date formats', function(done) {
        var schema = Joi.object({
            name: Joi.date().format('DD MMM YYYY HH:mm:ss Z')
        });
        go(schema, done);
    });

    it('should handle custom iso formats', function(done) {
        var schema = Joi.object({
            name: Joi.date().iso()
        });
        go(schema, done);
    });

});
