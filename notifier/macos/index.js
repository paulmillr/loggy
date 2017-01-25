'use strict';
const tmpdir = require('os').tmpdir();
const exists = require('fs').existsSync;
const sh = require('../sh');

const appsDir = `${tmpdir}/loggy`;
const script = `${__dirname}/notify.applescript`;
const defaultIcon = '/Applications/Utilities/Terminal.app/Contents/Resources/Terminal.icns';

sh`mkdir -p ${appsDir}`;

const getAppPath = (appName, iconSrc) => {
  const appPath = `${appsDir}/${appName}.app`;
  if (!exists(appPath)) {
    sh`osacompile -o ${appPath} ${script}`;

    const iconDest = `${appPath}/Contents/Resources/applet.icns`;
    if (iconSrc.endsWith('.icns')) {
      sh`cp ${iconSrc} ${iconDest}`;
    } else {
      sh`sips -s format icns ${iconSrc} --out ${iconDest}`;
    }

    const bundleId = `com.paulmillr.loggy.${appName}`;
    const plistPath = `${appPath}/Contents/Info.plist`;
    sh`plutil -replace CFBundleIdentifier -string ${bundleId} ${plistPath}`;
    sh`plutil -replace LSBackgroundOnly -bool YES ${plistPath}`;
  }

  return appPath;
};

module.exports = opts => {
  const env = {
    TITLE: opts.title,
    MESSAGE: opts.message,
  };

  const icon = opts.icon || defaultIcon;
  const appPath = getAppPath(opts.app, icon);

  sh.async({env})`open -a ${appPath}`;
};
