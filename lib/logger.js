'use strict'

const bunyan = require('bunyan')
const mkdirp = require('mkdirp').sync
const join = require('path').join
const serialErr = require('./serialErr')
const RotateLog = require('rotatelog-stream').RotateLogStream
const bunyanPretty = require('./_pretty')

/**
 * opt {
 *   name:    is.string,
 *   logDir:  is.string,   - '/path/to/log/directory'
 *   keep:    is.number,   - how many log files to keep if `logDir` exists
 *   maxsize: is.number,   - max file size allowed if `logDir` exists
 *   dev:     is.bool,     - print log to stdout or not,
 *   streams: is.array,    - additional streams for Bunyan
 * }
 *
 * @param opt
 */
module.exports = function(opt) {

  opt = opt === Object(opt) ? opt : {}

  var name = typeof opt.name == 'string' && opt.name.length > 1 ? opt.name : 'bunlogger'
  var streams = Array.isArray(opt.streams) ? opt.streams : []

  if (opt.logDir) {

    let log = join(opt.logDir, name + '.log')
    let errlog = join(opt.logDir, name + '-error.log')

    mkdirp(opt.logDir)

    let _opt = {}
    _opt.keep = /^\d+$/.test(opt.keep) ? opt.keep : 5
    _opt.maxsize = /^\d+$/.test(opt.maxsize) && opt.maxsize > 1024*100 ? opt.maxsize : 1024*1024*5

    streams = streams.concat([
      {
        level: 'trace',
        stream: new RotateLog(Object.assign(_opt, {path: log}))
      },
      {
        level: 'error',
        stream: new RotateLog(Object.assign(_opt, {path: errlog}))
      }
    ])
  }

  if (!streams.length || opt.dev === true) {
    if (process.stdout.isTTY) {
      streams.push({ level: 'trace', stream: bunyanPretty()})
    }
    else {
      streams.push({ level: 'trace', stream: process.stdout})
    }
  }

  var customized = {
    err: serialErr,

    // modified from bunyan for express
    req: function(req) {
      if (!req || !req.connection) {return req}

      return {
        method: req.method,
        url: req.originalUrl || req.url,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort
      }
      // Trailers: Skipping for speed. If you need trailers in your app, then
      // make a custom serializer.
      //if (Object.keys(trailers).length > 0) {
      //  obj.trailers = req.trailers;
      //}
    }
  }
  var serializers = Object.assign(bunyan.stdSerializers, customized)

  return bunyan.createLogger({
    name,
    streams,
    serializers
  })
}
