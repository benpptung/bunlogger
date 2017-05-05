'use strict';

var spawn   = require('child_process').spawn;
var through = require('through');
var path    = require('path');
var fs      = require('fs');

module.exports = prettyStream;

function prettyStream(args) {
  args = Array.isArray(args) ? args : ['-o', 'long', '-L'];
  var bin = path.join(__dirname, '_bunyan');
  var stream = through(function write(data) {
    this.queue(data);
  }, function end () {
    this.queue(null);
  });

  var formatter = spawn(bin, args, {
    stdio: [null, process.stdout, process.stderr]
  });
  stream.pipe(formatter.stdin);
  return stream;
}