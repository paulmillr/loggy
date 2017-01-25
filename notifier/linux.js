'use strict';
const sh = require('./sh');

const cmd = 'notify-send';
const notify = opts => {
  const icon = opts.icon || 'terminal';
  sh.async`${cmd} -i ${icon} ${opts.title} ${opts.message}`;
};

module.exports = (() => {
  try {
    sh`which ${cmd}`;
    return notify;
  } catch (error) {
    return () => {};
  }
})();
