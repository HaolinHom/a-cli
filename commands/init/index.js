const path = require('path');
const fs = require('fs');
const std = require('std-terminal-logger');
const { prompt } = require('enquirer');
const DEFAULT_PROJECT_CONFIG = require('../../dict/common/DEFAULT_PROJECT_CONFIG');
const CONFIG = require('../../dict/common/CONFIG');

async function init() {
  const currentPath = process.cwd();
  const tagCfgPath = path.resolve(currentPath, CONFIG.PROJECT_CONFIG);

  if (fs.existsSync(tagCfgPath)) {
    std.warn(`${tagCfgPath} is already existed`);
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
  }

  const { pluginName } = await prompt({
    name: 'pluginName',
    type: 'input',
    message: 'Please type the plugin name: ',
    initial: `${path.parse(currentPath).name}-cli-plugin`,
  });

  let config = Object.assign({}, DEFAULT_PROJECT_CONFIG);
  config.name = pluginName;

  fs.writeFileSync(
    tagCfgPath,
    JSON.stringify(config, null, 2),
    { encoding: 'utf8' }
  );
}

module.exports = init;