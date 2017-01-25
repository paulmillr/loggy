'use strict';
const sh = require('./sh');

const cmd = 'notify-send';
const which = sh`which ${cmd}`;

const notify = opts => {
  sh.async`${cmd} -i ${opts.icon} ${opts.title} ${opts.message}`;
};

module.exports = which.error ? () => {} : notify;
