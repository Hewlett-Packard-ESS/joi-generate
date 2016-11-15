'use strict';
var BooleanTypeHandler = function(opts) {
    var chance = opts.chance;

    return {
        handle: function(schema, callback) {
            // Start with a random integer
            var msg = chance.bool();
            callback(null, msg);
        }
    };
};
module.exports = BooleanTypeHandler;
