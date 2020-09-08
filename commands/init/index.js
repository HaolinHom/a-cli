const path = require('path');
const fs = require('fs');
const { std } = require('wu-utils');
const { prompt } = require('enquirer');

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

  fs.writeFileSync(
    tagCfgPath,
`{
  "name": "${pluginName}",
  "publish": {
  	"options": [],
  	"config": null
  }
}`,
    { encoding: 'utf8' }
  );
}

module.exports = init;