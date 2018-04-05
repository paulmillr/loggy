declare module 'loggy' {
  type Level = 'error' | 'warn' | 'log' | 'info' | 'success';

  interface Logger {
    /** logs messages in red to stderr, creates notification. */
    error(...args: any[]);

    /** logs messages in yellow to stdout. */
    warn(...args: any[]);

    /** logs messages in red to stderr, creates notification. */
    log(...args: any[]);

    /** logs messages in green to stdout. */
    info(...args: any[]);

    /** logs messages in green to stdout. */
    success: Logger['info'];

    /** function that does color and date formatting. */
    format(level: string);

    /** `false`, changes to `true` if any error was logged. */
    readonly errorHappened: boolean;

    /**
     * Mapping of log levels to colors.
     * Can be `object`, like `{error: 'red', log: 'cyan'}` or `false` (disables colors). */
    colors: Record<Level, 'string'> | false;

    /**
     * As `Boolean`, enables or disables notifications for errors, or as `Array`,
     * list types to trigger notifications, like `['error', 'warn', 'success']`.
     */
    notifications: boolean | Level[];

    /** String, optional, prepends title in notifications */
    notificationsTitle: string;

    dumpStacks: boolean | Level;
  }

  const logger: Logger;

  export = logger;
}
