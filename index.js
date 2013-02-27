'use strict';
var color = require('ansi-color');
var growl = require('growl');
require('date-utils');

var slice = [].slice;

var logger = {
  // Format of date in logs.
  entryFormat: 'DD MMM HH24:MI:SS',

  // Enables / disables system notifications for errors.
  notifications: true,

  // Colors that will be used for various log levels.
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    log: 'green',
    success: 'green'
  },

  // May be used for setting correct process exit code.
  errorHappened: false,

  // Creates new colored log entry.
  // Example:
  //
  //     format('warn')
  //     # => 21 Feb 11:24:47 - warn:
  //
  // Returns String.
  format: function(level, entryFormat) {
    var date = new Date().toFormat(entryFormat || logger.entryFormat);
    var colored = logger.colors ? color.set(level, logger.colors[level]) : level;
    return '' + date + ' - ' + colored + ':';
  },

  _log: function(level, args) {
    var entry = logger.format(level);
    var all = [entry].concat(args);

    process.nextTick(function() {
      if (level === 'error' || level === 'warn') {
        console.error.apply(console, all);
      } else {
        console.log.apply(console, all);
      }
    });
  },

  error: function() {
    var args = slice.call(arguments);
    if (logger.notifications) growl(args.join(' '), {title: 'Error'});
    logger.errorHappened = true;
    logger._log('error', args);
  }
};

['warn', 'info', 'log', 'success'].forEach(function(key) {
  logger[key] = function() {
    logger._log(key, slice.call(arguments));
  };
});

module.exports = logger;
