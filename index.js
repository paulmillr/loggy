'use strict';
const chalk = require('chalk');
const notifier = require('node-notifier');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const logger = {
  // Enables or disables system notifications for errors.
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
  // logger.format('warn') // => 'Jan 1, 08:59:45 - warn:'
  // Returns string.
  format(level) {
    // Jan 1, 11:08:31
    const date = new Date().toLocaleTimeString('en-US', {
      month: 'short',
      day: 'numeric',
      hour12: false,
    });

    const color = logger.colors[level];
    const paint = chalk[color];
    const painted = typeof paint === 'function' ? paint(level) : level;

    return `${date} - ${painted}:`;
  },

  _notify(level, args) {
    if (level === 'error') logger.errorHappened = true;
    const settings = logger.notifications;
    if (settings === false) return;
    const types = Array.isArray(settings) ? settings : ['error'];
    if (!types.includes(level)) return;

    const title = logger.notificationsTitle ? logger.notificationsTitle + ' ' : '';
    notifier.notify({
      title: title + capitalize(level),
      message: args.join(' '),
    });
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
          const color = chalk[logger.dumpStacks] || chalk.gray;
          console.error(color(error.stack.replace(`Error: ${error.message}\n`, '')));
        } else {
          const color = chalk.gray;
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
