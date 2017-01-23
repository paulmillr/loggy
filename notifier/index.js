'use strict';

const exists = require('fs').existsSync;
const exec = require('child_process').exec;
const sh = require('child_process').execSync;

const tmpdir = require('os').tmpdir();
const loggyDir = `${tmpdir}/loggy`;
const srcPath = `${__dirname}/notify.applescript`;

exec(`mkdir -p ${loggyDir}`);

const appWithIcon = (appName, iconPath) => {
  const appPath = `${loggyDir}/${appName}.app`;
  if (!exists(appPath)) {
    sh(`osacompile -o ${appPath} ${srcPath}`);

    const icnsPath = `${appPath}/Contents/Resources/applet.icns`;
    sh(`sips -s format icns ${iconPath} --out ${icnsPath}`);

    const bundleId = `com.paulmillr.loggy.${appName}`;
    const plistPath = `${appPath}/Contents/Info.plist`;
    sh(`plutil -replace CFBundleIdentifier -string ${bundleId} ${plistPath}`);
    sh(`plutil -replace LSBackgroundOnly -bool YES ${plistPath}`);
  }

  return appPath;
};

module.exports = options => {
  const appPath = appWithIcon(options.app, options.icon);
  console.log(appPath);
  const env = {
    TITLE: options.title,
    MESSAGE: options.message,
    PPID: process.pid,
  };

  exec(`open -a ${appPath}`, {env});
};
