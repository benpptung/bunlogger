'use strict';

const bunyan = require('bunyan');
const mkdirp = require('mkdirp').sync;
const join = require('path').join;
const serialErr = require('./serialErr');
const RotateLog = require('rotatelog-stream').RotateLogStream;

/**
 * opt {
 *   name:     {String},
 *   [logDir]: 'path/to/log/directory',
 *   [keep]:     {Number}                 - how many log files keep
 *   [maxsize]:  {Number}                 - max filesize allowed
 *   [dev]:      {Boolean}                - for dev or not
 *   [streams]:  {Array}                  - additional streams for Bunyan
 * }
 * @param opt
 */
module.exports = function(opt) {

  opt = opt === Object(opt) ? opt : {};

  var name = typeof opt.name == 'string' && opt.name.length > 1 ? opt.name : 'bunlogger';
  var streams = Array.isArray(opt.streams) ? opt.streams : [];

  if (opt.logDir) {

    let log = join(opt.logDir, name + '.log');
    let errlog = join(opt.logDir, name + '-error.log');

    mkdirp(opt.logDir);

    let _opt = {};
    _opt.keep = /^\d+$/.test(opt.keep) ? opt.keep : 5;
    _opt.maxsize = /^\d+$/.test(opt.maxsize) && opt.maxsize > 1024*100 ? opt.maxsize : 1024*1024*5;

    streams = streams.concat([
      {
        level: 'trace',
        stream: new RotateLog(Object.assign(_opt, {path: log}))
      },
      {
        level: 'error',
        stream: new RotateLog(Object.assign(_opt, {path: errlog}))
      }
    ]);
  }

  if (!streams.length || opt.dev === true) {
    streams.push({ level: 'trace', stream: process.stdout });
  }

  return bunyan.createLogger({
    name,
    streams,
    serializers: Object.assign(bunyan.stdSerializers, {err: serialErr})
  });
};