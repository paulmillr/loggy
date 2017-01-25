'use strict';
const exists = require('fs').existsSync;
const tmpdir = require('os').tmpdir();
const sh = require('../sh');

const appsDir = `${tmpdir}/loggy`;
const scriptPath = `${__dirname}/notify.applescript`;

sh.async`mkdir -p ${appsDir}`;

const getAppPath = (appName, iconPath) => {
  const appPath = `${appsDir}/${appName}.app`;
  if (!exists(appPath)) {
    sh`osacompile -o ${appPath} ${scriptPath}`;

    const icnsPath = `${appPath}/Contents/Resources/applet.icns`;
    sh`sips -s format icns ${iconPath} --out ${icnsPath}`;

    const bundleId = `com.paulmillr.loggy.${appName}`;
    const plistPath = `${appPath}/Contents/Info.plist`;
    sh`plutil -replace CFBundleIdentifier -string ${bundleId} ${plistPath}`;
    sh`plutil -replace LSBackgroundOnly -bool YES ${plistPath}`;
  }

  return appPath;
};

module.exports = options => {
  const env = {
    TITLE: options.title,
    MESSAGE: options.message,
  };
  const exec = sh.async({env});

  if (options.icon) {
    const appPath = getAppPath(options.app, options.icon);

    exec`open -a ${appPath}`;
  } else {
    exec`osascript ${scriptPath}`;
  }
};
