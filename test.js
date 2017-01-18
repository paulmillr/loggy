'use strict';
const logger = require('.');
const ONE_SEC = 1000;

logger.log('Hello, loggy');
logger.warn('Deprecated');
logger.info(new Date());
logger.error('Oops');

setTimeout(() => {
  logger.error(new TypeError('undefined is not a function'));
}, ONE_SEC);
