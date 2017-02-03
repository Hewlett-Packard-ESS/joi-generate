'use strict';
var _ = require('lodash');
var prefix = 'joi:generate:';
var chance = new require('chance').Chance();

var TypeFactory = function() {
    var self = {};
    var debug = require('debug')(prefix + 'factory');

    var typeHandlers = {
        object: require('./handlers/object'),
        string: require('./handlers/string'),
        array: require('./handlers/array'),
        number: require('./handlers/number'),
        boolean: require('./handlers/boolean'),
        date: require('./handlers/date'),
        any: require('./handlers/any'),
        binary: require('./handlers/binary'),
        alternatives: require('./handlers/alternatives')
    };
    (function initHandlers() {
        _.forEach(Object.keys(typeHandlers), function(key) {
            var handlerDebug = require('debug')(prefix + 'handler:' + key);
            typeHandlers[key] = new typeHandlers[key]({
                typeFactory: self,
                debug: handlerDebug,
                chance: chance
            });
        });
    })();

    self.gimme = function(schema, callback) {
        debug('gimme', schema._type);
        var handler = typeHandlers[schema._type];
        if (!handler) {
            return callback(new Error('No handler has been implemented for ' + schema._type + ' yet.'));
        }
        debug('found type handler for', schema._type);
        callback(null, handler);
    };
    return self;
};

var typeFactory = new TypeFactory();

var Generator = function() {
    var generate = function(schema, callback) {
        var promise = new Promise(function(resolve, reject) {
            typeFactory.gimme(schema, function(err, tf) {
                if (err) {
                    reject(err);
                } else {
                    tf.handle(schema, function (err, val) {
                        if (err) {
                            reject(err);
                        }
                        resolve(val);
                    });
                }
            });
        });

        if (callback && typeof callback === 'function') {
            promise.then(callback.bind(null, null), callback);
        }

        return promise;
    };
    return Object.freeze(generate);
};
module.exports = Generator;
