'use strict';
const exists = require('fs').existsSync;
const tmpdir = require('os').tmpdir();
const sh = require('../sh');

const appsDir = `${tmpdir}/loggy`;
sh.async`mkdir -p ${appsDir}`;

const termIcon = `${__dirname}/term-icon.applescript`;
const defaultIcon = sh`osascript ${termIcon}`;

const notify = `${__dirname}/notify.applescript`;
const getAppPath = (appName, iconSrc) => {
  const appPath = `${appsDir}/${appName}.app`;
  if (!exists(appPath)) {
    sh`osacompile -o ${appPath} ${notify}`;

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
  const icon = opts.icon || defaultIcon;
  const env = {
    TITLE: opts.title,
    MESSAGE: opts.message,
  };

  const appPath = getAppPath(opts.app, icon);
  sh.async({env})`open -a ${appPath}`;
};
