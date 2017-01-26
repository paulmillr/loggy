'use strict';

const sh = require('../sh');
const notify = `${__dirname}/notify.ps1`;

module.exports = opts => {
  sh.async`powershell -file ${notify}
    -app ${opts.app} -icon ${opts.icon}
    -title ${opts.title} -message ${opts.message}
  `;
};