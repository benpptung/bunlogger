'use strict';

const print = require('../').printErr;

try {
  new NotExist();
} catch (er) {
  print(er)
}
