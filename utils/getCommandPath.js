const path = require('path');
const fs = require('fs');
const { std } = require('wu-utils');

/*
* @param {string} command
* @return {string|bool} filePath or false
* */
function getCommandPath(command) {
  command = command || process.argv[2];
  if (!command) {
    std.error('wucli [command] is invalid');
    return false;
  }
  const currentPath = process.cwd();
  const configPath = path.resolve(currentPath, 'wu-cli-config.json');

  if (fs.existsSync(configPath)) {
    const config = require(configPath);
    if (!config.name) {
      std.error('wu-cli-config.json must have name attribute');
      return false;
    }
    const commandJsPath = path.resolve(currentPath, `${config.name}/${command}.js`);
    if (fs.existsSync(commandJsPath)) {
      return commandJsPath;
    }

    std.error(`${commandJsPath} is not exist`);
    return false;
  }

  std.error(`${configPath} is not exist`);
  return false;
}

module.exports = getCommandPath;