'use strict';

const Logger = require('..').Logger;
const join = require('path').join;
const colors = require('colors');

var log = new Logger({logDir: join(__dirname, 'log')});

log.info('hi info');
log.warn('hi warn');
log.error('hi error');

console.log();
console.log('open ' + join(__dirname, 'log'));