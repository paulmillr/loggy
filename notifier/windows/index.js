'use strict';

const sh = require('../sh');
const script = `${__dirname}\\notify.ps1`;

module.exports = opts => {
  sh.async`powershell ${script}
    -app ${opts.app} -icon ${opts.icon}
    -title ${opts.title} -message ${opts.message}
  `;
};
