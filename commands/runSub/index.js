const fs = require('fs');
const path = require('path');
const { removeExtname } = require('hey-yoo-utils/pathExtra');
const { runFunc } = require('hey-yoo-utils/common');

/*
* running sub command, like this: hey [command] [sub_command]
* */
module.exports = function(subCommand, dirname) {
  if (!subCommand) {
    throw new Error(`Missing required argument [command]!`);
  }
  if (!dirname) {
    throw new Error(`runSub's second parameter dirname is require!`);
  }

  const tagSubDirPath = path.resolve(dirname, 'sub');

  const subCommands = fs.readdirSync(tagSubDirPath)
    .map((file) => (/^\S+.js$/.test(file) ? removeExtname(file) : false))
    .filter(Boolean);
  if (subCommands.indexOf(subCommand) === -1) {
    throw new Error(`Please type the valid [command] (${subCommands.join(', ')})`);
  }

  const tagJs = require(path.resolve(tagSubDirPath, `${subCommand}.js`));
  runFunc(tagJs);
}