'use strict';

const inspect = require('util').inspect;
const serialErr = require('./serialErr');
const colors = require('colors');

module.exports = function(err) {

  err = serialErr(err);
  let stack = err.stack.split('\n').filter(Boolean);
  delete err.stack;

  console.log(inspect(err, {colors: true}));
  stack.forEach(line=> console.error(line.magenta));
};