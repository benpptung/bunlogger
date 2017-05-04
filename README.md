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
1. `error log` and `access log` share the same `cor_id`, so you can associate the error log to the access log happened at the same time.
2. `req.log` is actually the bunyan logger, simply `req.log.info('...')` will share the same `cor_id` in the `access log` and `error log`. 
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
app.use(logger.error());
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


###cli

make sure bunyan is installed globally

```
$ DEBUG=* node bin/www | bunyan
```

# Options

 - name:     {String},
 - logDir:   'path/to/log/directory'  - directory to save log files
 - keep:     {Number}                 - how many log files keep. See [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream)
 - maxsize:  {Number}                 - max filesize allowed. See [rotatelog-stream](https://www.npmjs.com/package/rotatelog-stream)
 - dev:      {Boolean}                - Enable `process.stdout` for development
 - streams:  {Array}                  - additional streams for Bunyan
 


