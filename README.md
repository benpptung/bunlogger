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
```
var pkg = require('../package.json'),
    bunlog = require('bunlogger'),
    express = require('express'),
    path = require('path');
    
// set up app
//===============
var app = express(),
    logger = app.logger = app.get('env') === 'production' ?
        bunlog({name: pkg.name, path : path.resolve(__dirname, 'log', pkg.name)}) :
        bunlog({name: pkg.name});
        // logging to a file in production environment or logging to process.stdout 

// as a middleware
app.use(logger.connect());

// as an error middleware
app.use(logger.error());

.....
// Example : logging in a request
function(req, res){
	auth.authenticate(req.body.username, req.body.password, function(err, user){
		if(err || !user){
			req.log.warn(err, 'login error %s', err);
			...
			return res.redirect('/login');
		}
		
		....
	}
}
```