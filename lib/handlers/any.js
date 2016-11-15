'use strict';

var ObjectTypeHandler = function() {
    return {
        handle: function(schema, callback) {
            var output = {};
            callback(null, output);
        }
    };
};
module.exports = ObjectTypeHandler;
