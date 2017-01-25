'use strict';
const sh = require('./sh');

module.exports = opts => {
  sh.async`notify-send -i ${opts.icon} ${opts.title} ${opts.message}`;
};
