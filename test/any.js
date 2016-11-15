'use strict';
var Joi = require('joi');
var generate = new require('../').Generate();
require('should');

describe('Any', function() {

    it('should generate something to pass the any validation', function(done) {
        var schema = Joi.any();
        generate(schema, function(err, model) {
            if (err) {
                return done(err);
            }

            var error = Joi.validate(model, schema);
            done(error.error);
        });
    });

});
