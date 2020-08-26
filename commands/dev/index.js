const { std } = require('wu-utils');
const getCommandPath = require('../../utils/getCommandPath');
const getContext = require('../../utils/getContext');
const getArgs = require('../../utils/getArgs');

async function dev() {
  const commandJsPath = getCommandPath();
  if (commandJsPath === false) {
    return;
  }
  const commandJs = require(commandJsPath);
  if (typeof commandJs === 'function') {
    // TODO: change to fork child_process
    commandJs(getContext(), getArgs());
  } else {
    std.error(`This file is not export a function(${commandJsPath})`);
  }
}

module.exports = dev;