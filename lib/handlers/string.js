'use strict';
var _ = require('lodash');
var RandExp = require('randexp');
var uuid = require('node-uuid');
var Onion = require('lib-onion');

var StringTypeHandler = function(opts) {
    var chance = opts.chance;
    var debug = opts.debug;

    var onion = new Onion('string');

    var Email = function(msg, schema, next, exit) {
        var test = _.find(schema._tests, {
            name: 'email'
        });
        if (test) {
            debug('generating an email');
            return exit(null, chance.email());
        }
        return next(null, msg, schema);
    };

    var Guid = function(msg, schema, next, exit) {
        var test = _.find(schema._tests, {
            name: 'guid'
        });
        if (test) {
            debug('generating a guid');
            return exit(null, uuid.v4());
        }
        return next(null, msg, schema);
    };

    var Ip = function(msg, schema, next, exit) {
        var test = _.find(schema._tests, {
            name: 'ip'
        });
        if (test) {
            debug('generating an ip');
            return exit(null, chance.ip());
        }
        return next(null, msg, schema);
    };

    var Hostname = function(msg, schema, next, exit) {
        var test = _.find(schema._tests, {
            name: 'hostname'
        });
        if (test) {
            debug('generating a hostname');
            return exit(null, chance.domain());
        }
        return next(null, msg, schema);
    };

    var MinLength = function(msg, schema, next) {
        var min = _.find(schema._tests, {
            name: 'min'
        });
        if (min) {
            min = min.arg;
            if (msg.length >= min) {
                // Message is OK as it is
                return next(null, msg, schema);
            }

            msg = chance.sentence({
                words: min
            });

            var goTo = chance.integer({
                min: min,
                max: min + 50 // Arbitary value
            });
            debug('generating a string of ' + goTo + ' characters');
            msg = msg.substr(0, goTo);
        }
        next(null, msg, schema);
    };

    var MaxLength = function(msg, schema, next) {
        /* jshint maxcomplexity: 6 */
        var max = _.find(schema._tests, {
            name: 'max'
        });
        if (max) {
            max = max.arg;
            if (msg.length <= max) {
                // Message is OK as it is
                return next(null, msg, schema);
            }

            msg = chance.sentence({
                words: max
            });

            var min = _.find(schema._tests, {
                name: 'min'
            });
            if (min) {
                min = min.arg;
            } else {
                min = max / 2;
            }
            var goTo = chance.integer({
                min: min,
                max: max
            });
            debug('generating a string between ' + min + ' and ' + max + ' characters');
            msg = msg.substr(0, goTo);
        }
        return next(null, msg, schema);
    };

    var RegEx = function(msg, schema, next) {
        var regex = _.find(schema._tests, {
            name: 'regex'
        });
        if (regex) {
            regex = regex.arg;
            debug('generating a regex');
            msg = new RandExp(regex).gen();
        }
        next(null, msg, schema);
    };

    onion.add(Guid, 'guid');
    onion.add(Email, 'email');
    onion.add(Ip, 'ip');
    onion.add(Hostname, 'hostname');
    onion.add(MinLength, 'min-length');
    onion.add(MaxLength, 'max-length');
    onion.add(RegEx, 'regex');

    return {
        handle: function(schema, callback) {
            // Start with a random string
            var msg = chance.sentence();
            onion.handle(msg, schema, function(err, output) {
                debug('output', output);
                callback(err, output);
            });
        }
    };
};
module.exports = StringTypeHandler;
