const { std } = require('wu-utils');
const getCommandPath = require('../../utils/getCommandPath');
const getContext = require('../../utils/getContext');
const packageInstall = require('../../utils/packageInstall');

async function dev(command) {
  const commandJsPath = getCommandPath('dev');
  if (commandJsPath === false) {
    return;
  }
  const commandJs = require(commandJsPath);
  if (typeof commandJs === 'function') {
    if (command.debug) {
      packageInstall();
    }
    commandJs(getContext(), [`debug=${command.debug}`]);
  } else {
    std.error(`This file is not export a function(${commandJsPath})`);
  }
}

module.exports = dev;