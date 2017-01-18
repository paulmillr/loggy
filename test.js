'use strict';
const logger = require('.');
const second = 1000;

logger.log('Hello, loggy');
logger.warn('Deprecated');
logger.info(new Date());
logger.error('Oops');

setTimeout(() => {
  logger.error(new TypeError('undefined is not a function'));
}, second);
