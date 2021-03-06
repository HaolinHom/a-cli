const path = require('path');
const std = require('std-terminal-logger');
const { prompt } = require('enquirer');
const {
  getPriorityPath,
  requireByType,
} = require('../../utils/common');
const { objectGenerateCjsFile } = require('../../utils/cjsFile');
const DEFAULT_PROJECT_CONFIG = require('../../dict/common/DEFAULT_PROJECT_CONFIG');
const CONFIG = require('../../dict/common/CONFIG');

module.exports = async function () {
  const currentPath = process.cwd();
  const configJsPath = path.join(currentPath, CONFIG.PROJECT_CONFIG);
  const configJsonPath = path.join(currentPath, CONFIG.PROJECT_CONFIG_JSON);

  let configPath = getPriorityPath([configJsPath, configJsonPath]);
  if (configPath) {
    std.warn(`${configPath} is already existed`);
    const { isOverwrite } = await prompt({
      name: 'isOverwrite',
      type: 'toggle',
      message: 'Do you want to overwrite: ',
      enabled: 'YES',
      disabled: 'NO',
    });
    if (!isOverwrite) {
      return;
    }
  } else {
    configPath = configJsPath;
  }

  let config = requireByType(configPath, 'object') || Object.assign({}, DEFAULT_PROJECT_CONFIG);

  const folderName = path.parse(currentPath).name;

  const { pluginName } = await prompt({
    name: 'pluginName',
    type: 'input',
    message: 'Please type the plugin name: ',
    initial: `${folderName}-cli-plugin`,
  });
  config.name = pluginName;

  const packageJson = requireByType(path.join(currentPath, CONFIG.PACKAGE_JSON), 'object') || {};
  config.projectName = packageJson.name || folderName;

  objectGenerateCjsFile(config, configPath);

  std.success('Finish initial project config file.');
};