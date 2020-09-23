const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const std = require('std-terminal-logger');

async function getPluginPath(pluginName) {
  if (!pluginName) {
    throw new Error(chalk.redBright('Missing required parameters[name] in getPluginPath()!'));
  }
  if (typeof pluginName !== 'string') {
    throw new Error(chalk.redBright('The parameter must be a string in getPluginPath()!'));
  }

	// prefer to use the plugins in the wu-cli/plugins directory, convenient to develop and debug plugins
  let pluginPath = path.resolve(__dirname, `../plugins/${pluginName}`);
  if (!fs.existsSync(pluginPath)) {
		pluginPath = path.resolve(process.cwd(), `node_modules/${pluginName}`);
		if (!fs.existsSync(pluginPath)) {
			return std.error(`${pluginName} is not exist.`);
		}
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