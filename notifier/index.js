'use strict';
const platform = require('os').platform();

module.exports = (() => {
  switch (platform) {
    case 'darwin': return require('./macos');
    case 'linux': return require('./linux');
    case 'win32': return require('./windows');
  }

  return () => {};
})();
