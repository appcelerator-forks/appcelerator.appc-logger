// jshint -W079
var should = require('should'),
	util = require('util'),
	ConsoleClass = require('./_console'),
	_console = new ConsoleClass(),
	index = require('../'),
	debug = require('debug')('appc:logger'),
	chalk = require('chalk'),
	ConsoleLogger = index.ConsoleLogger,
	defaultTravis = process.env.TRAVIS,
	defaultArgs = process.argv;

/**
 * Adds a regular expression that will match the timestamp added to debug and trace logs.
 * @returns {RegExp}
 */
String.prototype.withTimestampPrefix = function () {
	var str = this;
	/**
	 * Expects a string to have a time prefix followed by a particular value.
	 */
	return function withTimestampPrefix(val) {
		if (!val.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z | /)) {
			debug('Failed timestamp prefix. Got: ' + val);
			return false;
		}
		return val.indexOf(str) > 0;
	};

};

describe('console', function () {

	before(function () {
		ConsoleLogger.resetColorize();
	});

	after(function () {
		_console.stop();
		ConsoleLogger.resetColorize();
		process.env.TRAVIS = defaultTravis;
		process.argv = defaultArgs;
	});

	it('should be able to log at info', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('INFO   | hello');
				callback();
			});
			var logger = index.createDefaultLogger();
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.setLevel('info');
			logger.info('hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should be able to set level', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('INFO   | hello');
				callback();
			});
			var logger = index.createDefaultLogger();
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			should(logger.level).be.a.function;
			should(logger.setLevel).be.a.function;
			logger.setLevel('info');
			logger.debug('goodbye');
			logger.info('hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should log timestamps when the level is set to trace', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			var data = [];
			_console.on('data', function (buf) {
				data.push(buf);
				debug(buf);
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('trace');
			logger.trace('i am trace');
			should(data[0]).match('TRACE  | i am trace'.withTimestampPrefix());
			logger.debug('i am debug');
			should(data[1]).match('DEBUG  | i am debug'.withTimestampPrefix());
			logger.info('i am info');
			should(data[2]).match('INFO   | i am info'.withTimestampPrefix());
			logger.warn('i am warn');
			should(data[3]).match('WARN   | i am warn'.withTimestampPrefix());
			logger.error('i am error');
			should(data[4]).match('ERROR  | i am error'.withTimestampPrefix());
			logger.fatal('i am fatal');
			should(data[5]).match('FATAL  | i am fatal'.withTimestampPrefix());
		}
		finally {
			_console.stop();
		}
		callback();
	});

	it('should not log timestamps when the level is set to info', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			var data = [];
			_console.on('data', function (buf) {
				data.push(buf);
				debug(buf);
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			logger.trace('i am trace');
			logger.debug('i am debug');
			should(data).have.property('length', 0);
			logger.info('i am info');
			should(data[0]).equal('INFO   | i am info');
			logger.warn('i am warn');
			should(data[1]).equal('WARN   | i am warn');
			logger.error('i am error');
			should(data[2]).equal('ERROR  | i am error');
			logger.fatal('i am fatal');
			should(data[3]).equal('FATAL  | i am fatal');
		}
		finally {
			_console.stop();
		}
		callback();
	});

	it('should log timestamps when the level is set to debug', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			var data = [];
			_console.on('data', function (buf) {
				debug(buf);
				data.push(buf);
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('debug');
			logger.trace('i am trace');
			should(data).have.property('length', 0);
			logger.debug('i am debug');
			should(data[0]).match('DEBUG  | i am debug'.withTimestampPrefix());
			logger.info('i am info');
			should(data[1]).match('INFO   | i am info'.withTimestampPrefix());
			logger.warn('i am warn');
			should(data[2]).match('WARN   | i am warn'.withTimestampPrefix());
			logger.error('i am error');
			should(data[3]).match('ERROR  | i am error'.withTimestampPrefix());
			logger.fatal('i am fatal');
			should(data[4]).match('FATAL  | i am fatal'.withTimestampPrefix());
		}
		finally {
			_console.stop();
		}
		callback();
	});

	it('should be able to log at debug', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).match('DEBUG  | hello'.withTimestampPrefix());
				callback();
			});
			var logger = index.createDefaultLogger();
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.debug('hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should be able to log at trace', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).match('TRACE  | hello'.withTimestampPrefix());
				callback();
			});
			var logger = index.createDefaultLogger();
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.trace('hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should be able to log at warn', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('WARN   | hello');
				callback();
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			logger.warn('hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should be able to log at error', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('ERROR  | hello');
				callback();
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			logger.error('hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should be able to log at fatal', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('FATAL  | hello');
				callback();
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			logger.fatal('hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should be able to log with object but have it ignored', function (callback) {
		should(ConsoleLogger).be.an.object;
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('INFO   | hello');
				callback();
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			logger.info({a:1}, 'hello');
		}
		finally {
			_console.stop();
		}
	});

	it('should be able to use format symbols', function (callback) {
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('INFO   | hello world 1');
				callback();
			});
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			logger.info('hello %s %d', 'world', 1);
		}
		finally {
			_console.stop();
		}
	});

	it('should remove color coding', function (callback) {
		var console_ = new ConsoleClass(false);
		try {
			console_.start();
			console_.on('data', function (buf) {
				console_.stop();
				should(buf).equal('INFO   | hello world 1');
				callback();
			});
			process.env.TRAVIS = 1; // force log coloring off
			ConsoleLogger.resetColorize();
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			var chalk = require('chalk');
			logger.info('hello %s %d', chalk.red('world'), 1);
		}
		finally {
			console_.stop();
		}
	});

	it('should remove log level', function (callback) {
		var console_ = new ConsoleClass(false);
		try {
			console_.start();
			console_.on('data', function (buf) {
				console_.stop();
				should(buf).equal('hello world');
				callback();
			});
			var logger = index.createLogger({prefix:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('hello world');
		}
		finally {
			console_.stop();
		}
	});

	it('should remove carriage return marker', function (callback) {
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('hello\nworld');
				callback();
			});
			var logger = index.createLogger({prefix:false, showcr:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('hello\nworld');
		}
		finally {
			_console.stop();
		}
	});

	it('should show carriage return marker', function (callback) {
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('hello↩\nworld↩');
				callback();
			});
			var logger = index.createLogger({prefix:false, showcr:true});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('hello\nworld');
		}
		finally {
			_console.stop();
		}
	});

	it('should show tab marker', function (callback) {
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('hello\t↠world');
				callback();
			});
			var logger = index.createLogger({prefix:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('hello\tworld');
		}
		finally {
			_console.stop();
		}
	});

	it('should remove tab marker', function (callback) {
		try {
			_console.start();
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('hello\tworld');
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('hello\tworld');
		}
		finally {
			_console.stop();
		}
	});

	it('should log the record if there is no message', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal(util.format({'hello':'world'}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info({'hello':'world'});
		}
		finally {
			_console.stop();
		}
	});

	it('should mask log record if only argument', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).not.equal(util.format({'password':'1234'}));
				should(buf).equal(util.format({'password':'[HIDDEN]'}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info({'password':'1234'});
		}
		finally {
			_console.stop();
		}
	});

	it('should mask password confirmation with dash', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).not.equal(util.format({'password-confirmation':'1234'}));
				should(buf).equal(util.format({'password-confirmation':'[HIDDEN]'}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info({'password-confirmation':'1234'});
		}
		finally {
			_console.stop();
		}
	});

	it('should mask password confirmation with underscore', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).not.equal(util.format({'password_confirmation':'1234'}));
				should(buf).equal(util.format({'password_confirmation':'[HIDDEN]'}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info({'password_confirmation':'1234'});
		}
		finally {
			_console.stop();
		}
	});

	it('should mask log arguments', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('your password is ' + util.format({'password':'[HIDDEN]'}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('your password is', {'password':'1234'});
		}
		finally {
			_console.stop();
		}
	});

	it('should mask log arguments that are nested', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('your password is ' + util.format({foo:{'password':'[HIDDEN]'}}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('your password is', {foo:{'password':'1234'}});
		}
		finally {
			_console.stop();
		}
	});

	it('should mask log arguments that are nested as 3rd arg', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('your password is ' + util.format({}) + ' ' + util.format({foo:{'password':'[HIDDEN]'}}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('your password is', {}, {foo:{'password':'1234'}});
		}
		finally {
			_console.stop();
		}
	});

	it('should mask log arguments using format', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal(util.format('your password is %j', {'password':'[HIDDEN]'}));
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('your password is %j', {'password':'1234'});
		}
		finally {
			_console.stop();
		}
	});

	it('should handle circular references', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('nested object is { key: { key: \'[Circular]\' } }');
				callback();
			});
			var obj = {};
			obj.key = obj;
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('nested object is', obj);
		}
		finally {
			_console.stop();
		}
	});

	it('should handle circular references', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('nested object is { key: { key: \'[Circular]\' } }');
				callback();
			});
			var obj = {};
			obj.key = obj;
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('nested object is', obj);
		}
		finally {
			_console.stop();
		}
	});

	it('should handle buffer references', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('buffer is [Buffer]');
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('buffer is', new Buffer('hello'));
		}
		finally {
			_console.stop();
		}
	});

	it('should handle RegExp references', function (callback) {
		try {
			this.timeout(1000);
			_console.start(1000);
			_console.on('data', function (buf) {
				_console.stop();
				should(buf).equal('buffer is /^foo$/');
				callback();
			});
			var logger = index.createLogger({prefix:false, showtab:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('buffer is', /^foo$/);
		}
		finally {
			_console.stop();
		}
	});

	it.skip('should color code if colorize is specified', function (callback) {
		var console_ = new ConsoleClass(false);
		try {
			chalk.enabled = true;
			console_.start();
			console_.on('data', function (buf) {
				console_.stop();
				should(buf).equal('\u001b[32mINFO  \u001b[39m \u001b[1m\u001b[90m|\u001b[39m\u001b[22m hello \u001b[31mworld\u001b[39m 1');
				callback();
			});
			var logger = index.createDefaultLogger({colorize:true, problemLogger:false});
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			logger.info('hello %s %d', chalk.red('world'), 1);
		}
		finally {
			console_.stop();
		}
	});

	it('should not color code if colorize is specified as false', function (callback) {
		var console_ = new ConsoleClass(false);
		try {
			console_.start();
			console_.on('data', function (buf) {
				console_.stop();
				should(buf).equal('INFO   | hello world 1');
				callback();
			});
			var logger = index.createDefaultLogger({colorize:false});
			logger.setLevel('info');
			var chalk = require('chalk');
			logger.info('hello %s %d', chalk.red('world'), 1);
		}
		finally {
			console_.stop();
		}
	});

	it('should not color code if --no-colors is specified', function (callback) {
		var console_ = new ConsoleClass(false);
		var args = process.argv;
		try {
			console_.start();
			console_.on('data', function (buf) {
				console_.stop();
				should(buf).equal('INFO   | hello world 1');
				callback();
			});
			process.argv = ['node', '--no-colors'];
			ConsoleLogger.resetColorize();
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			var chalk = require('chalk');
			logger.info('hello %s %d', chalk.red('world'), 1);
		}
		finally {
			console_.stop();
			process.argv = args;
		}
	});

	it('should not color code if --no-color is specified', function (callback) {
		var console_ = new ConsoleClass(false);
		var args = process.argv;
		try {
			console_.start();
			console_.on('data', function (buf) {
				console_.stop();
				should(buf).equal('INFO   | hello world 1');
				callback();
			});
			process.argv = ['node', '--no-color'];
			ConsoleLogger.resetColorize();
			var logger = index.createDefaultLogger();
			logger.setLevel('info');
			var chalk = require('chalk');
			logger.info('hello %s %d', chalk.red('world'), 1);
		}
		finally {
			console_.stop();
			process.argv = args;
		}
	});

	it.skip('should color code if --colorize is specified', function (callback) {
		var console_ = new ConsoleClass(false);
		var args = process.argv;
		try {
			console_.start();
			console_.on('data', function (buf) {
				console_.stop();
				should(buf).equal('\u001b[32mINFO  \u001b[39m \u001b[1m\u001b[90m|\u001b[39m\u001b[22m hello \u001b[31mworld\u001b[39m 1');
				callback();
			});
			process.argv = ['node', '--colorize'];
			ConsoleLogger.resetColorize();
			var logger = index.createDefaultLogger();
			should(logger).be.an.object;
			should(logger.info).be.a.function;
			var chalk = require('chalk');
			logger.info('hello %s %d', chalk.red('world'), 1);
		}
		finally {
			console_.stop();
			process.argv = args;
		}
	});

	it('should prepend pid for cluster worker logs', function (callback) {
		var spawn = require('child_process').spawn;
		var path = require('path');
		var child = spawn(process.execPath, [path.join(__dirname, '_cluster.js')], {cwd: __dirname});
		var output;
		child.stdout.on('data', function (buf) {
			output = String(buf);
		});
		child.stderr.on('data', function (buf) {
			console.log(String(buf));
		});
		child.on('exit', function (err) {
			if (err !== 0) {
				callback(new Error('exit code ' + err));
			} else {
				should(output).match(/INFO\s|\s(\d+)\s|\shello/);
				callback();
			}
		});
	});
});
