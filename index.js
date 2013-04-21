'use strict';
var color = require('ansi-color');
var growl = require('growl');
require('date-utils');

var slice = [].slice;

var logger = {
  // Format of date in logs.
  entryFormat: 'DD MMM HH24:MI:SS',

  // Enables / disables system notifications for various log levels.
  notifications: {error: true},

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

  _normalizeNotificationsSetting: function () {
    var arrayToObj, 
        normalized = {};

    arrayToObj = function (arr, obj) {
      arr.forEach(function(key) { obj[key] = true; });
    }

    switch (typeof this.notifications) {
      case 'boolean':
        normalized.error = this.notifications;
        break;
      case 'string':
        arrayToObj(this.notifications.split(/\W+/), normalized);
        break;
      case 'object':
        if (Array.isArray(this.notifications)) {
          arrayToObj(this.notifications, normalized);
        } else {
          //ensure not null
          if (this.notifications) normalized = this.notifications;
        }
        break;
    }
    this.notifications = normalized;
  }
};

['error', 'warn', 'info', 'log', 'success'].forEach(function(key) {
  logger[key] = function() {
    var args = slice.call(arguments),
        title = capitalize(key);
    //normalize here so setting can be re-configured dynamically any time
    this._normalizeNotificationsSetting();
    if (logger.notifications[key]) growl(args.join(' '), {title: title});
    if (key === 'error') logger.errorHappened = true;
    logger._log(key, args);
  };
});

var capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = logger;
