# loggy

Colorful stdstream dead-simple logger for node.js.

* Logs stuff to stdout (`log`, `info`, `success`).
* Logs errors & warnings to stderr (`warn`, `error`).
* Adds colors to log types (e.g. `warn`, `info` words will be colored).
* Creates OS X / growl / libnotify notifications for errors.
* Tracks whether any error was logged (useful for changing process exit code).

![Screen Shot 2013-04-21 at 03 26 41](https://f.cloud.github.com/assets/574696/405855/2fe7271e-aa1a-11e2-8b85-347e71ac49f9.png)

Install with `npm install loggy`.

## Usage

Example:

```javascript
var logger = require('loggy');

// Logs “27 Feb 09:08:34 - info: Hello, loggy to stdout.
// “info” word is green.
logger.info('Hello', 'loggy');

// Logs “27 Feb 09:08:40 - warn: Deprecated to stderr. “warn” word is yellow.
logger.warn('Deprecated');

// Logs “27 Feb 09:08:40 - error: Stuff” to stderr.
// Creates growl / OS X / libnotify notification “Stuff”.
// “error” word is red.
logger.error('Stuff');

// Exit with proper code.
process.on('exit', function() {
   process.exit(logger.errorHappened ? 1 : 0);
});

// Disable colors.
logger.colors = false;

// Disable system notifications.
logger.notifications = false;

// Enable notifications for more methods
logger.notifications = ['error', 'warn', 'success'];

// Prepend the notifications title
logger.notificationsTitle = 'My App'

// Dump stacks of Error objects as the first argument to error or warning
logger.dumpStacks = true // 'blue' etc for your choice of color
```

`loggy` takes the default value for `dumpStacks` from the `LOGGY_STACKS` environment variable.

Methods:

* `logger.error(...args)` - logs messages in red to stderr, creates notification
* `logger.warn(...args)` - logs messages in yellow to stdout
* `logger.log(...args)`, `logger.info`, `logger.success` -
  logs messages in green to stdout.
* `logger.format(level)` - function that does color and date formatting.

Params:

* `logger.colors` - mapping of log levels to colors.
  Can be object, like `{error: 'red', log: 'green'}` or `false`
  (disables colors).
* `logger.errorHappened` - `false`, changes to `true` if any error was logged.
* `logger.notifications` - As Boolean, enables or disables notifications for errors, or
  as Array, list types to trigger notifications, like `['error', 'warn', 'success']`.
* `logger.notificationsTitle` - String, optional, prepends title in notifications.

To create your own logger, simply clone the logger object.

## License

[The MIT license](https://github.com/paulmillr/mit)
