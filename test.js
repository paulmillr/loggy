var logger = require('./');

//logger.notificationsTitle = 'Brunch';
//logger.notifications = 'error warn';
//logger.notifications = 'error, warn';
//logger.notifications = ['error', 'warn'];
//logger.notifications = {error: true, warn: true, title: 'Brunch'};
//logger.notifications = '*';
//logger.notifications = 'all';
//logger.notifications = 'none';

var delay = function(fn) {
  setTimeout(fn, 1000);
};

delay(function() {
  logger.log('Hello, loggy');
  delay(function() {
    logger.warn('Deprecated');
    delay(function() {
      logger.error('Stuff');
    });
  });
});
