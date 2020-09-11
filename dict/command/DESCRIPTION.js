const { chalk } = require('wu-utils');

module.exports = {
  INIT: chalk.color.pink('initial project with wu-cli-config'),
  DEV: chalk.color.deepPurple('develop project with wu-cli-config'),
  RUN: chalk.color.blue('run customize command'),
  BUILD: chalk.color.cyan('build project with wu-cli-config'),
  PUBLISH: chalk.color.green('publish project with wu-cli-config'),
  SETTING: chalk.color.lime('open the cli setting file'),
  PLUGIN: chalk.color.amber('plugin manager(include "new", "link", "unlink", "publish" commands)'),
  INSTALL: chalk.color.deepOrange(`install the wu-cli-plugin that published on "npm"`),
};