const fs = require('fs');
const path = require('path');
const { std, pathExtra } = require('wu-utils');
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
    return std.error(`Missing required argument 'command' (wucli plugin [command])`);
  }
  const actions = getActions();
  if (!actions.includes(command)) {
    return std.error(`Please input the right plugin 'command' (commands: [${actions.join(', ')}])`);
  }

  const actionJsPath = path.resolve(__dirname, `actions/${command}.js`);
  if (getExistPath(actionJsPath)) {
    const actionJs = require(actionJsPath);
    if (typeof actionJs === 'function') {
      actionJs();
    }
  }
}

module.exports = plugin;