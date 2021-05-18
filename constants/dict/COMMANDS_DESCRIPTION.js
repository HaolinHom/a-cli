const chalk = require('chalk');

module.exports = {
  INIT: chalk.keyword('crimson')('initial project with a-cli-config'),
	RUN: chalk.keyword('darkviolet')('run customize command'),
  PLUGINS: chalk.keyword('royalblue')('plugins manager(include "new", "link", "unlink", "list", "install", "uninstall", "enable", "unable" commands)'),
  PACKS: chalk.keyword('deepskyblue')(`packs manager(include "new", "link", "unlink", "list" commands)`),
  SETTING: chalk.keyword('mediumseagreen')('open the cli setting file'),
};