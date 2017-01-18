'use strict';
const logger = require('.');
const ONE_SEC = 1000;

logger.log('Hello, loggy');
logger.warn('Deprecated');
logger.info(new Date());
logger.error('Oops');

setTimeout(() => {
  logger.error(new TypeError('undefined is not a function'));
  logger.dumpStacks = true;

  setTimeout(() => {
    logger.error(new TypeError('stack is showed'));
  }, ONE_SEC);
}, ONE_SEC);
