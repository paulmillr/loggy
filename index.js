'use strict';
const colors = require('./colors');
const notifier = require('node-notifier');

const capitalize = str => str[0].toUpperCase() + str.slice(1);
const MAX_TITLE_WINDOWS = 5000;

const logger = {
  // Enables / disables system notifications for errors.
  notifications: true,

  // Colors that will be used for various log levels.
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    log: 'green',
    success: 'green',
  },

  // May be used for setting correct process exit code.
  errorHappened: false,

  // Dump stacks on errors
  dumpStacks: process.env.LOGGY_STACKS !== undefined,

  // Creates new colored log entry. Example:
  // format('warn') // => Jan 1, 08:59:45 - warn:
  //
  // Returns String.
  format(level) {
    // 30 May 19:44:27
    const date = new Date().toLocaleTimeString('en-US', {
      month: 'short',
      day: 'numeric',
      hour12: false,
    });

    const colorName = logger.colors[level];
    const fn = colors[colorName];
    const colored = logger.colors && fn ? fn(level) : level;
    return `${date} - ${colored}:`;
  },

  _notify(level, args) {
    if (level === 'error') logger.errorHappened = true;
    const notifSettings = logger.notifications;

    if (notifSettings === false) {
      return;
    }

    if (logger._notificationTypes == null) {
      const items = logger._notificationTypes = {};
      if ('notifications' in logger) {
        if (typeof notifSettings === 'object') {
          notifSettings.forEach(name => {
            items[name] = true;
          });
        } else {
          items.error = true;
        }
      }
    }
    const types = logger._notificationTypes;

    if (logger._title == null) {
      logger._title = logger.notificationsTitle ?
        logger.notificationsTitle + ' ' : '';
    }
    const title = logger._title;

    if (types[level]) {
      let string = args.join(' ');
      const isWin = /^win/.test(process.platform);
      // cut the notification on windows to 5000 chars to avoid the ENAMETOOLONG error (https://github.com/brunch/brunch/issues/1354)
      if (isWin) string = string.slice(0, MAX_TITLE_WINDOWS);
      notifier.notify({
        title: title + capitalize(level),
        message: string,
      });
    }
  },

  _log(level, args) {
    const entry = logger.format(level);
    let all = [entry].concat(args);

    if (level === 'error') {
      all = all.concat(['\u0007']);
    }

    if (level === 'error' || level === 'warn') {
      const error = all.find(x => x instanceof Error);

      if (error) {
        const texts = all.map(x => x instanceof Error ? x.message : x);
        console.error.apply(console, texts);

        if (logger.dumpStacks) {
          const color = colors[logger.dumpStacks] || colors.brightBlack;
          console.error(color(error.stack.replace(`Error: ${error.message}\n`, '')));
        } else {
          const color = colors.brightBlack;
          console.log(color('Stack trace was suppressed. Run with `LOGGY_STACKS=true` to see the trace.'));
        }
      } else {
        console.error.apply(console, all);
      }
    } else {
      console.log.apply(console, all);
    }
  },
};

Object.keys(logger.colors).forEach(key => {
  logger[key] = function() {
    const args = Array.from(arguments);
    logger._notify(key, args);
    logger._log(key, args);
  };
});

module.exports = logger;
