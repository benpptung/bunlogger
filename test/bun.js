var bunlogger = require('../index.js'),
    path = require('path'),
    fs = require('fs'),
    express = require('express'),
    request = require('supertest');

describe('bunlogger init:', function () {
  it('should default to stdout stream', function () {
    var logger = bunlogger();
    logger.streams[0].stream.should.be.exactly(process.stdout);
    logger.streams[0].level.should.be.exactly(10);
  });

  describe('#option path added', function () {

    var logfile = path.resolve(__dirname, 'fixtures', 'cache', 'log');

    it('stream out to a log file if path option added', function () {
      var logger = bunlogger({ path: logfile});
      logger.streams[0].path.should.be.exactly(logfile);
      logger.streams[0].type.should.be.equal('file');
      logger.streams[0].level.should.be.equal(10);
    });

    it('update level by bunyan level option', function () {
      var logger = bunlogger({path: logfile, level: 'error'});
      logger.streams[0].path.should.be.exactly(logfile);
      logger.streams[0].type.should.be.equal('file');
      logger.streams[0].level.should.be.equal(50);
    });

    it('update level to TRACE if incorrect level name', function () {
      var logger = bunlogger({ path: logfile, level: 'fff'});
      logger.streams[0].path.should.be.exactly(logfile);
      logger.streams[0].type.should.be.equal('file');
      logger.streams[0].level.should.be.equal(10);
    });

    it('create logfile, if logfile non-exist', function (done) {
      fs.unlinkSync(logfile); // must already created in previous tests

      var logger = bunlogger({ path: logfile});
      fs.stat(logfile, function (err, stats) {
        if (err) return done(err);
        stats.should.be.an.Object;
        done();
      })
    })
  })
});

describe('bunlogger.middleware', function () {
  describe('#connect()', function () {

    it('should log the request', function (done) {

      var logfile = path.resolve(__dirname, 'fixtures', 'cache', 'connect.log');
      try { fs.unlinkSync(logfile) } catch (err) {} //remove the log file if it exist
      var app = express(),
          logger = bunlogger({path: logfile}),
          log;

      app.use(logger.connect());

      request(app)
          .get('/')
          .end(function (err, res) {

            log = fs.readFileSync(logfile, 'utf8');
            log = JSON.parse(log);
            log.msg.should.be.equal('access log');
            log.should.have.property('cor_id');
            done();
          });
    });
  });

  describe('#error()', function () {

    it('should log the error and associate error to access log', function (done) {

      var logfile = path.resolve(__dirname, 'fixtures', 'cache', 'error.log');
      try { fs.unlinkSync(logfile) } catch (err) {} //remove the log file if it exist
      var app = express(),
          logger = bunlogger({path: logfile}),
          log, logs = [],
          error_msg = 'fun';

      app.use(logger.connect());
      app.get('/', function(req, res, next){
        next(new Error(error_msg));
      });
      app.use(logger.error());

      request(app)
          .get('/')
          .end(function (err, res) {

            log = fs.readFileSync(logfile, 'utf8');
            log = log.split(/[\n\r]/);

            for(var i = 0, len = log.length -  1; i < len; i++ ){
              logs.push(JSON.parse(log[i]));
            }

            logs[0].cor_id.should.be.equal(logs[1].cor_id);
            logs[0].err.message.should.be.equal(error_msg);
            done();
          });

    });
  });
});