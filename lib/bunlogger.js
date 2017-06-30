'use strict';

const Logger = require('./logger');
const uuid = require('node-uuid');

module.exports = function(opt) {

  var logger = new Logger(opt);

  logger.connect = function () {
    return function (req, res, next) {

      req.log = logger.child({cor_id: uuid()})
      req._starttime = Date.now();
      req.on('finish', logging);
      res.on('close', logging);
      return next();

      function logging() {
        res.removeListener('finish', logging);
        res.removeListener('close', logging);
        req.log.info({
          req,
          res,
          elapsed: ( Date.now() - req._starttime )
        }, 'access log');
      }
    }
  };

  logger.error = function () {
    return function (err, req, res, next) {

      var serious = !err.status || parseInt(err.status) >= 500;
      serious ? req.log.error(err, '5xx error: %s', err) :
        req.log.warn(err, 'warning error: %s', err);
      
      next(err);
    }
  };

  return logger;
};