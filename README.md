bunlogger
=========

express logging middlewares built on [bunyan](https://www.npmjs.com/package/bunyan) and [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream)

Installation
=====
```
$ npm install bunlogger --save
```

Features
========
1. `app.use(logger.connect())` will populate the `req.log`, which is actually a child of the bunyan logger, simply `req.log.info('...')` will share the same `cor_id` in the `access log` and `error log`. cor_id is exposed on `req.cor_id`;

2. logging `req.log.fatal()`, `req.log.error()` into error log file. If error is sent to `next(err)` and `req.log['fatal|error']` not got called, middleware `app.use(logger.onError())` will log this error by `error.status` automatically. err.status == 4xx is warn level, err.status == 5xx is error level.
 
3. `elapsed` show the time spent in this `req`.

4. Integrate with [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream) for rotating logs to files.

5. See logging on the console in developing stage.


Quick Start
==========

### express
```
const express = require('express');
const AppLogger = require('bunlogger');
const logDir = require('path').join(__dirname, 'log');

   
var app = express();
app.log = new AppLogger({dev: true, logDir});
```

populate `req.log` and log all accesses

```
app.use(app.log.connect());
```

Catch express next(err) for logging, but skip if req.log got called above warn level.

```
app.use(app.log.onError());
```

`log` directory created and `bunlogger.log`, `bunlogger-error.log` created.

Finally, render `req.cor_id` in the final error handler, so the customer can contact you with `cor_id` for help.

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

A handy tool to replace console.error(err). 

```
const printErr = require('bunlogger').printErr;

try {
  new NotExist();
} catch (er) {
  printErr(er)
}

```


### cli

```
$ DEBUG=* node bin/www
```

# Options

 - name:     {String},
 - logDir:   'path/to/log/directory'  - directory to save log files
 - keep:     {Number}                 - how many log files keep. See [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream)
 - maxsize:  {Number}                 - max filesize allowed. See [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream)
 - dev:      {Boolean}                - Pipe logs to `process.stdout` for development, so we can see how logging file looks like in console.
 - streams:  {Array}                  - additional streams for Bunyan
 


