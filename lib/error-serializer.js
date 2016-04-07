'use strict';

const serizlier = require('util-superagent-serializer');

/**
 * Modified from:
 * https://github.com/trentm/node-bunyan/blob/master/lib/bunyan.js#L1120
 */

function getFullErrorStack(ex)
{
  var ret = ex.stack || ex.toString();
  if (ex.cause && typeof (ex.cause) === 'function') {
    var cex = ex.cause();
    if (cex) {
      ret += '\nCaused by: ' + getFullErrorStack(cex);
    }
  }
  return (ret);
}


module.exports = function err(err) {
  if (!err || !err.stack)
    return err;
  var obj = {
    message: err.message,
    name: err.name,
    stack: getFullErrorStack(err),
    code: err.code,
    signal: err.signal
  };

  if (err.address) obj.address = err.address;
  if (err.port) obj.port = err.port;
  if (err.status) obj.status = err.status;

  /**
   * append my own error properties to serialize
   */

  // ErrCode added when third-party error, or my own created error
  if (err.errco) obj.errco = err.errco;

  if (err.response) obj.response = serizlier(err.response);

  // superagent
  if (err.original) obj.original = err.original;

  // for me
  if (err.more) obj.more = err.more;

  return obj;
};