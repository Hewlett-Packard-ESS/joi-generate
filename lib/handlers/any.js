'use strict';
// var async = require('async');

var ObjectTypeHandler = function(opts) {
// var typeFactory = opts.typeFactory;
// var debug = opts.debug;

  return {
    handle: function(schema, callback) {
      var output = {};
      callback(null, output);
    }
  };
};
module.exports = ObjectTypeHandler;
