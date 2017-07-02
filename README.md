bunlogger
=========

logging utilities built on Bunyan and RotateLog-Stream

Installation
=====
```
$ npm install bunlogger --save
```

Features
========
1. `app.use(logger.connect())` will populate the `req.log`, which is actually the bunyan logger, simply `req.log.info('...')` will share the same `cor_id` in the `access log` and `error log`.

2. logging `req.log.fatal()`, `req.log.error()`, `req.log.warn()` into error log file. If error is sent to `next(err)` and req.log not got called, middleware `app.use(logger.onError())` will log this error by `error.status` automatically. err.status == 4xx is warn level, err.status == 5xx is error level.
 
3. `elapsed` show the time spent in this `req`.

4. Use [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream) for rotating logs.

5. Better error information for debugging.


Quick Start
==========

### express
```
const express = require('express');
const Bunlog = require('bunlogger');

   
var app = express();
var logger = new Bunlog();

// as a middleware
app.use(logger.connect());

// as an error handler
app.use(logger.onError());
```

### Create logger

logger is using [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream) for rotating logs. 

```
const Logger = require('..').Logger;
const join = require('path').join;

var log = new Logger({logDir: join(__dirname, 'log')});

log.info('hi info');
log.warn('hi warn');
log.error('hi error');

```

### Print Error

```
const print = require('bunlogger').printErr;

try {
  new NotExist();
} catch (er) {
  print(er)
}

```


### cli

make sure bunyan is installed globally

```
$ DEBUG=* node bin/www | bunyan
```

# Options

 - name:     {String},
 - logDir:   'path/to/log/directory'  - directory to save log files
 - keep:     {Number}                 - how many log files keep. See [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream)
 - maxsize:  {Number}                 - max filesize allowed. See [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream)
 - dev:      {Boolean}                - Enable `process.stdout` for development, so we can see how logging file looks like in console.
 - streams:  {Array}                  - additional streams for Bunyan
 


