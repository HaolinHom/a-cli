const chalk = require('chalk');

module.exports = {
  INIT: chalk.keyword('crimson')('initial project with wu-cli-config'),
  DEV: chalk.keyword('darkviolet')('develop project with wu-cli-config'),
  RUN: chalk.keyword('royalblue')('run customize command'),
  BUILD: chalk.keyword('deepskyblue')('build project with wu-cli-config'),
  PUBLISH: chalk.keyword('mediumseagreen')('publish project with wu-cli-config'),
  SETTING: chalk.keyword('greenyellow')('open the cli setting file'),
  PLUGIN: chalk.keyword('yellow')('plugin manager(include "new", "link", "unlink", "publish", "list" commands)'),
  INSTALL: chalk.keyword('orange')(`install the wu-cli-plugin that published on "npm"`),
};