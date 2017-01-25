'use strict';
const sh = require('./sh');

const cmd = 'notify-send';
const which = sh`which ${cmd}`;
const notify = opts => {
  const icon = opts.icon || 'terminal';
  sh.async`${cmd} -i ${icon} ${opts.title} ${opts.message}`;
};

module.exports = which.error ? () => {} : notify;
