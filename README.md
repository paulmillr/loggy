# loggy

Colorful stdstream dead-simple logger for node.js.

* Logs stuff to stdout (`log`, `info`, `success`).
* Logs errors & warnings to stderr (`warn`, `error`).
* Adds colors to log types (e.g. `warn`, `info` words will be colored). Uses [chalk](https://github.com/chalk/chalk).
* Emits system notifications for errors with [node-notifier](https://github.com/mikaelbr/node-notifier).
* Tracks whether any error was logged (useful for changing process exit code).

![Screen Shot 2013-04-21 at 03 26 41](https://f.cloud.github.com/assets/574696/405855/2fe7271e-aa1a-11e2-8b85-347e71ac49f9.png)

Install with `npm install loggy`.

## Usage

Example:

```javascript
var logger = require('loggy');

// "Jan 18, 05:48:30 - log: Hello, loggy" to stdout.
// "info" word is cyan.
logger.info('Hello', 'loggy');

// "Jan 18, 05:48:30 - warn: Deprecated" to stderr.
// "warn" word is yellow.
logger.warn('Deprecated');

// Logs "Jan 18, 05:48:30 - error: Oops" to stderr.
// "error" word is red.
// Emits system notifications with title "Error" and message "Oops”.
logger.error('Oops');

// Exit with proper code.
process.on('exit', () => {
   process.exit(logger.errorHappened ? 1 : 0);
});

// Disable colors.
logger.colors = false;

// Disable system notifications.
logger.notifications = false;

// Enable notifications for more methods
logger.notifications = ['error', 'warn', 'success'];

// Prepend the notifications title
logger.notificationsTitle = 'My App';

// Dump stacks of Error objects in errors or warnings
logger.dumpStacks = true; // or color of your choice
```

Environment variables:

`LOGGY_STACKS`: default value for `dumpStacks`. Pass `true` to see the stacks.
`FORCE_NO_COLOR`: disables color output in `chalk`. Does not affect `logger.colors`.

Methods:

* `logger.error(...args)` - logs messages in red to stderr, creates notification.
* `logger.warn(...args)` - logs messages in yellow to stdout.
* `logger.log(...args)` - logs messages in cyan to stdout.
* `logger.info`, `logger.success` - logs messages in green to stdout.
* `logger.format(level)` - function that does color and date formatting.

Params:

* `logger.colors` - mapping of log levels to colors.
  Can be object, like `{error: 'red', log: 'cyan'}` or `false` (disables colors).
* `logger.errorHappened` - `false`, changes to `true` if any error was logged.
* `logger.notifications` - As Boolean, enables or disables notifications for errors, or
  as Array, list types to trigger notifications, like `['error', 'warn', 'success']`.
* `logger.notificationsTitle` - String, optional, prepends title in notifications.

## License

[MIT](https://github.com/paulmillr/mit) (c) 2016 Paul Miller (http://paulmillr.com)
