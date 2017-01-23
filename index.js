'use strict';
const sysPath = require('path');
const notify = require('./notifier');
const Chalk = require('chalk').constructor;
const chalk = new Chalk('FORCE_NO_COLOR' in process.env && {enabled: false});

const today = () => new Date().setHours(0, 0, 0, 0);
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const prettifyErrors = err => {
  if (!(err instanceof Error)) return err;
  if (!logger.dumpStacks) return err.message + stackSuppressed;

  const stack = err.stack.slice(err.stack.indexOf('\n'));
  const color = chalk[logger.dumpStacks] || chalk.gray;

  return err.message + color(stack);
};

const bell = '\x07';
const initTime = today();
const stackSuppressed = chalk.gray('\nStack trace was suppressed. Run with `LOGGY_STACKS=true` to see the trace.');

const logger = {
  // Enables or disables system notifications for errors.
  notifications: {
    app: 'Loggy',
    icon: sysPath.resolve('loggy.png'),
    levels: ['error'],
  },

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
  // logger.format('warn') // => '08:59:45 - warn:'
  // Returns string.
  format(level) {
    const locale = {hour12: false};
    if (initTime !== today()) {
      // Jan 1, 11:08:31
      locale.day = 'numeric';
      locale.month = 'short';
    }

    const date = new Date().toLocaleTimeString('en-US', locale);
    const colors = logger.colors;
    if (colors !== false) {
      const color = colors[level];
      const paint = chalk[color];
      if (typeof paint === 'function') level = paint(level);
    }

    return `${date} - ${level}:`;
  },

  _notify(level, args) {
    const settings = logger.notifications;
    if (!settings) return;
    if (!settings.levels.includes(level)) return;

    const app = settings.app;
    notify({
      app,
      icon: settings.icon,
      title: `${app} ${capitalize(level)}`,
      message: args.join(' '),
    });
  },

  _log(level, args) {
    args = [logger.format(level)].concat(args);
    if (level === 'error' || level === 'warn') {
      args = args.map(prettifyErrors);
    }
    if (level === 'error') {
      logger.errorHappened = true;
      args.push(bell);
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
