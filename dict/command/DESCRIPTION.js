const chalk = require('chalk');

module.exports = {
  INIT: chalk.keyword('crimson')('initial project with a-cli-config'),
	RUN: chalk.keyword('darkviolet')('run customize command'),
  DEV: chalk.keyword('royalblue')('develop project with a-cli-config'),
  BUILD: chalk.keyword('deepskyblue')('build project with a-cli-config'),
  SETTING: chalk.keyword('mediumseagreen')('open the cli setting file'),
  PLUGIN: chalk.keyword('greenyellow')('plugin manager(include "new", "link", "unlink", "publish", "list" commands)'),
  INSTALL: chalk.keyword('yellow')(`install the a-cli-plugin that published on "npm"`),
};