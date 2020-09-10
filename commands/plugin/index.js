const fs = require('fs');
const path = require('path');
const { std, pathExtra } = require('wu-utils');
const getExistPath = require('../../utils/getExistPath');
const PLUGIN = require('../../dict/command/PLUGIN');

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
    return std.error(PLUGIN.ERROR.MISSING_ARGUMENT_COMMAND);
  }
  const actions = getActions();
  if (!actions.includes(command)) {
    return std.error(`${PLUGIN.ERROR.TYPE_INVALID_COMMAND} [${actions.join(', ')})`);
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