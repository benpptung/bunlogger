'use strict'

const Logger = require('./logger')
const ReqLogger = require('./req.log')

module.exports = function(opt) {

  var logger = new Logger(opt)

  logger.connect = function() {
    return function(req, res, next) {

      req.log = ReqLogger(logger)
      req._starttime = Date.now()
      req.cor_id = req.log.cor_id

      res.on('finish', logging)
      res.on('close', logging)
      return next()

      function logging() {
        res.removeListener('finish', logging)
        res.removeListener('close', logging)
        req.log.info({
          req,
          res,
          elapsed: ( Date.now() - req._starttime )
        }, 'access log')
      }
    }
  }


  logger.onError = function() {

    return function(err, req, res, next) {

      if (req.log.__logs.indexOf(err) < 0) { // skip logged error
        let serious = !err.status || parseInt(err.status) >= 500

        serious ? req.log.error(err, '5xx error: %s', err)
          : req.log.warn(err, 'warning error: %s', err)
      }

      next(err)
    }
  }

  return logger
}
