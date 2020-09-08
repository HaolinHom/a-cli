const path = require('path');
const fs = require('fs');
const { chalk, std } = require('wu-utils');
const getExistPath = require('./getExistPath');

async function getPluginPath(pluginName) {
  if (!pluginName) {
    throw new Error(chalk.redBright('Missing required parameters[name] in getPluginPath()!'));
  }
  if (typeof pluginName !== 'string') {
    throw new Error(chalk.redBright('The parameter must be a string in getPluginPath()!'));
  }

  const pluginPath = await getExistPath(path.resolve(__dirname, `../plugins/${pluginName}`));
  if (!pluginPath) {
    return;
  }

  const stats = fs.statSync(pluginPath);
  if (stats.isDirectory()) {
    return pluginPath;
  }

  const lStats = fs.lstatSync(pluginPath);
  if (lStats.isSymbolicLink()) {
    return fs.readlinkSync(pluginPath);
  }

  std.warn(`${pluginPath} is not a directory or link`);
}

module.exports = getPluginPath;