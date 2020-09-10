const path = require('path');
const fs = require('fs');
const { std } = require('wu-utils');
const { prompt } = require('enquirer');
const defaultConfig = require('./defaultConfig');

async function init() {
  const currentPath = process.cwd();
  const tagCfgPath = path.resolve(currentPath, 'wu-cli-config.json');

  if (fs.existsSync(tagCfgPath)) {
    std.warn(`${tagCfgPath} is already existed`);
    const { isOverwrite } = await prompt({
      name: 'isOverwrite',
      type: 'toggle',
      message: 'Are you sure to overwrite :',
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
    message: 'Please input the plugin name: ',
    initial: `${path.parse(currentPath).name}-cli-plugin`,
  });

  let config = Object.assign({}, defaultConfig);
  config.name = pluginName;

  fs.writeFileSync(
    tagCfgPath,
    JSON.stringify(config, null, 2),
    { encoding: 'utf8' }
  );
}

module.exports = init;