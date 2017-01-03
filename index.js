'use strict';
const notifier = require('node-notifier');
const Chalk = require('chalk').constructor;
const chalk = new Chalk('FORCE_NO_COLOR' in process.env && {enabled: false});

const bell = '\x07';
const stackSuppressed = chalk.gray('\nStack trace was suppressed. Run with `LOGGY_STACKS=true` to see the trace.');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const prettifyErrors = err => {
  if (!(err instanceof Error)) return err;
  if (logger.dumpStacks) {
    const stack = err.stack.slice(err.stack.indexOf('\n'));
    const color = chalk[logger.dumpStacks] || chalk.gray;

    return err.message + color(stack);
  }

  return err.message + stackSuppressed;
};

const logger = {
  // Enables or disables system notifications for errors.
  notifications: true,

  // Colors that will be used for various log levels.
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    log: 'cyan',
    success: 'green',
  },

  // May be used for setting correct process exit code.
  errorHappened: false,

  // Dump stacks on errors
  dumpStacks: process.env.LOGGY_STACKS === 'true',

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

    const colors = logger.colors;
    if (colors !== false) {
      const color = colors[level];
      const paint = chalk[color];
      if (typeof paint === 'function') level = paint(level);
    }

    return `${date} - ${level}:`;
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
    args = [logger.format(level)].concat(args);
    if (level === 'error') args.push(bell);
    if (level === 'error' || level === 'warn') {
      args = args.map(prettifyErrors);
    }

    const log = console[level] || console.log;
    log.apply(console, args);
  },
};

Object.keys(logger.colors).forEach(level => {
  logger[level] = function() {
    const args = Array.from(arguments);

    logger._notify(level, args);
    logger._log(level, args);
  };
});

module.exports = logger;
