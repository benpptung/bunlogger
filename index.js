var path = require('path'),
    bunyan = require('bunyan'),
    uuid = require('node-uuid'),
    extend = require('node.extend'),
    mkdirp = require('mkdirp');

module.exports = function(options){

  options = options || {};
  var streams = options.streams || [],
      logger;

  if (options.path) {
    streams.push({
      path: options.path,
      type: 'file',
      level: options.level && bunyan[options.level.toUpperCase()] || bunyan.TRACE
    });
    mkdirp.sync(path.dirname(options.path));
  }
  if (options.stream) streams.push({
    stream: options.stream,
    type: 'stream',
    level: options.level && bunyan[options.level.toUpperCase()] || bunyan.TRACE
  });
  if (streams.length == 0) streams.push({
    stream: process.stdout,
    type: 'stream',
    level: options.level && bunyan[options.level.toUpperCase()] || bunyan.TRACE
  });

  // return the logger
  bunyan.stdSerializers.req = function req(req) {
    if (!req || !req.connection)
      return req;
    return {
      method: req.method,
      url: req.originalUrl || req.url, // in express req.url is changed
      headers: req.headers,
      remoteAddress: req.connection.remoteAddress,
      remotePort: req.connection.remotePort
    };
  };


  logger = bunyan.createLogger({
    name : options.name || 'express app',
    streams: streams,
    serializers:extend(bunyan.stdSerializers, {
      clietReq: client_req,
      clietRes: client_res
    })
  });

  logger.connect = function(){
    return function(req, res, next){

      req.log = logger.child( {cor_id: uuid.v4()} );
      req._starttime = new Date();
      res.on('finish', logging);
      res.on('close', logging);
      return next();

      function logging(){
        res.removeListener('finish', logging);
        res.removeListener('close', logging);
        req.log.info({
          req: req,
          res: res,
          elapsed: new Date - req._starttime
        }, 'access log');
      }
    };
  };

  logger.error = function (){
    return function(err, req, res, next){
      req.log.warn(err, 'error log: %s', err);
      next(err);
    };
  }

  return logger;
};




// serializers

function client_req(req) {
  if (!req) return req;

  var host;
  try {
    host = req.host.split(':')[0];
  }
  catch (er) {
    host = false;
  }

  return {
    method: req ? req.method : false,
    url: req ? req.path : false,
    address: host,
    port: req ? req.port : false,
    headers: req ? req.headers : false
  };
}

function client_res(res) {
  if (!res || !res.statusCode) return res;

  return {
    statusCode: res.statusCode,
    headers: res.headers
  };
}