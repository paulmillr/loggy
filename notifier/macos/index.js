'use strict';
const exists = require('fs').existsSync;
const tmpdir = require('os').tmpdir();
const sh = require('../sh');

const loggyDir = `${tmpdir}/loggy`;
const srcPath = `${__dirname}/notify.applescript`;

sh.async`mkdir -p ${loggyDir}`;

const appWithIcon = (appName, iconPath) => {
  const appPath = `${loggyDir}/${appName}.app`;
  if (!exists(appPath)) {
    sh`osacompile -o ${appPath} ${srcPath}`;

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
  const appPath = appWithIcon(options.app, options.icon);
  const env = {
    TITLE: options.title,
    MESSAGE: options.message,
  };

  sh.async({env})`open -a ${appPath}`;
};
