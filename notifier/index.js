'use strict';

const spawn = require('child_process').spawn;

module.exports = (title, message) => {
  spawn('osascript', [
    `${__dirname}/notify.applescript`,
    title || '',
    message || '',
  ]);
};
