'use strict';

const uuid = require('node-uuid');

module.exports = function(bunyan_logger) {

  var cor_id = uuid();
  var logger = bunyan_logger.child({cor_id});
  var log = { errorLogged: false };

  ['fatal', 'error', 'warn', 'info', 'debug', 'trace'].forEach((level, index)=> {

    log[level] = function() {

      var args = Array.prototype.slice.call(arguments);

      if (index < 3) log.errorLogged = true;
      logger[level].apply(logger, args);
    }
  });


  log.cor_id = cor_id;
  return log;
};