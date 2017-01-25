'use strict';
const tag = (spawn, options) => function(arg) {
  if (!Array.isArray(arg)) return tag(spawn, arg);

  const args = [];

  arg.forEach((string, index) => {
    string.split(/\s+/).forEach(arg => {
      if (arg) args.push(arg);
    });

    const arg = arguments[index + 1];
    if (arg != null) args.push(arg);
  });

  const cmd = args.shift();

  return spawn(cmd, args, options);
};

const cp = require('child_process');
const sh = tag(cp.spawnSync);
sh.sync = sh;
sh.async = tag(cp.spawn);

module.exports = sh;
