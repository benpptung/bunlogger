bunlogger
=========

express middleware powered by bunyan

Installation
=====
```
$ npm install bunlogger --save
```

Features
========
1. `error log` and `access log` share the same `cor_id`, so you can associate the error log to the access log happened at the same time.
2. `req.log` is actually the bunyan logger, simply `req.log.info('...')` will share the same `cor_id` in the `access log` and `error log`. 
3. `elapsed` show the time spent in this `req`.


Usage
==========

###app.js
```
const express = require('express');
const config = require('config');
const Bunlog = require('bunlogger');

   
// set up app
//===============
var app = express();
var logger = Bunlog(config.bunlog);

// as a middleware
app.use(logger.connect());

// as an error middleware
app.use(logger.error());
```

###config/index.js
```
const join = require('path').join;
const pkgname = require('../package.json').name;
const production = process.env.NODE_ENV == 'production';


  // logging config
var bunlog = {name: pkgname};
if (production) bunlog.path = join(__dirname, '..', 'logs', pkgname + '.log');

exports.bunlog = bunlog;
```
