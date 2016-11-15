'use strict';
var _ = require('lodash');
var Onion = require('lib-onion');

var ObjectTypeHandler = function(opts) {
    var debug = opts.debug;
    var chance = opts.chance;

    var onion = new Onion('string');

    var Min = function(tests, options, next) {
        var minimum = _.find(tests, {
            name: 'min'
        });
        if (minimum) {
            minimum = minimum.arg;
            options.length = minimum;
        }

        next(null, tests, options);
    };

    var Max = function(tests, options, next) {
        var maximum = _.find(tests, {
            name: 'max'
        });
        if (maximum) {
            maximum = maximum.arg;
            options.length = maximum;
        }

        next(null, tests, options);
    };

    var Length = function(tests, options, next) {
        var length = _.find(tests, {
            name: 'length'
        });
        if (length) {
            length = length.arg;
            options.length = length;
        }

        next(null, tests, options);
    };

    onion.add(Min, 'min');
    onion.add(Max, 'max');
    onion.add(Length, 'length');

    return {
        handle: function(schema, callback) {
            var encoding = schema._flags.encoding || 'utf-8';
            var options = {
                encoding: encoding,
                length: 8
            };
            onion.handle(schema._tests, options, function(err, output) {
                output = new Buffer(chance.word({
                    length: options.length
                }), encoding);
                debug('output', output);
                callback(err, output);
            });
        }
    };
};
module.exports = ObjectTypeHandler;
