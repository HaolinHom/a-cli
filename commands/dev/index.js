const { std } = require('wu-utils');
const getCommandPath = require('../../utils/getCommandPath');
const getContext = require('../../utils/getContext');
const getArgs = require('../../utils/getArgs');
const packageInstall = require('../../utils/packageInstall');

async function dev(command) {
  const isDebug = command.debug;
  const commandJsPath = getCommandPath();
  if (commandJsPath === false) {
    return;
  }
  const commandJs = require(commandJsPath);
  if (typeof commandJs === 'function') {
    if (isDebug) {
      packageInstall();
    }
    // TODO: change to fork child_process
    commandJs(getContext(), getArgs());
  } else {
    std.error(`This file is not export a function(${commandJsPath})`);
  }
}

module.exports = dev;