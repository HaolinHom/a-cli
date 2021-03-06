const fs = require('fs');
const path = require('path');
const { pathExtra } = require('hey-yoo-utils');
const std = require('std-terminal-logger');
const getExistPath = require('../../utils/getExistPath');

function getActions() {
  const actionsDirPath = path.resolve(__dirname, 'actions');
  let fileList = fs.readdirSync(actionsDirPath);
  if (fileList.length > 0) {
    return fileList.map(item => pathExtra.removeExtname(item));
  }
  return [];
}

async function plugin(command) {
  if (!command) {
    return std.error(`Missing required argument 'command' (acli plugin [command])`);
  }
  const actions = getActions();
  if (!actions.includes(command)) {
    return std.error(`Please type the valid plugin [command] (${actions.join(', ')})`);
  }

  const actionJsPath = await getExistPath(path.resolve(__dirname, `actions/${command}.js`));
  if (actionJsPath) {
    const actionJs = require(actionJsPath);
    if (typeof actionJs === 'function') {
      actionJs();
    }
  }
}

module.exports = plugin;