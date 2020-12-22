const path = require('path');
const fs = require('fs');
const std = require('std-terminal-logger');
const { prompt } = require('enquirer');
const {
  getPriorityPath,
  requireByType,
} = require('../../utils/common');
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

  const { pluginName } = await prompt({
    name: 'pluginName',
    type: 'input',
    message: 'Please type the plugin name: ',
    initial: `${path.parse(currentPath).name}-cli-plugin`,
  });
  config.name = pluginName;

  let fileData = JSON.stringify(config, null, 2);
  if (path.extname(configPath) === '.js') {
    fileData = fileData.replace(/"(\w*)":/g, function(match) {
      return match.replace(/"/g, '');
    });
    fileData = `module.exports = ${fileData};`;
  }

  fs.writeFileSync(configPath, fileData, { encoding: 'utf8' });
  std.success('Finish initial project config file.');
};