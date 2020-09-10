const path = require('path');
const fs = require('fs');
const { std } = require('wu-utils');
const { prompt } = require('enquirer');
const ora = require('ora');
const download = require('download-git-repo');
const CONFIG = require('../../../dict/common/CONFIG');
const getExistPath = require('../../../utils/getExistPath');
const typeOf = require('../../../utils/typeOf');
const DEFAULT_PLUGIN_CONFIG = require('../../../dict/common/DEFAULT_PLUGIN_CONFIG');

function templateFilter(item) {
  return (
    item.name && typeof item.name === 'string'
    &&
    item.repo && typeof item.repo === 'string'
  );
}

async function getTemplate(defaultTemplate = CONFIG.DEFAULT_TEMPLATE) {
  const settingPath = await getExistPath(path.resolve(__dirname, '../../../local/setting.json'));
  if (settingPath) {
    const setting = require(settingPath);
    if (typeOf(setting) === 'object' && Array.isArray(setting.templates)) {
      let _templates = setting.templates.filter(templateFilter);
      const len = _templates.length;
      if (len > 1) {
        const { templateName } = await prompt({
          name: 'templateName',
          type: 'select',
          message: 'Please select the cli plugin template that you want: ',
          choices: _templates.map(item => item.name),
        });
        return _templates.find(item => item.name === templateName);
      } else if (len === 1) {
        return _templates[0];
      }
    }
  }

  return defaultTemplate;
}

function updatePackage(packageName, rootPath) {
  const packagePath = path.resolve(rootPath, 'package.json');

  let pkg;
  if (fs.existsSync(packagePath)) {
    pkg = require(packagePath);
    if (typeOf(pkg) === 'object') {
      pkg.name = packageName;
    }
  } else {
    pkg = {
      name: packageName,
      version: '1.0.0',
      description: '',
    }
  }

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2), { encoding: 'utf8' });

  return pkg;
}

function initialWuCliJson(pluginName, rootPath) {
  const jsonPath = path.resolve(rootPath, CONFIG.PLUGIN_CONFIG);

  let wuCliJson = Object.assign({}, DEFAULT_PLUGIN_CONFIG);
  wuCliJson.pluginName = pluginName;

  fs.writeFileSync(jsonPath, JSON.stringify(wuCliJson, null, 2), { encoding: 'utf8' });
}

module.exports = async function () {
  const currentPath = process.cwd();

  const { pluginName } = await prompt({
    name: 'pluginName',
    type: 'input',
    message: 'Please type the cli plugin name: ',
    initial: 'my-project-cli-plugin',
  });
  const tagPath = path.resolve(currentPath, pluginName);

  if (fs.existsSync(tagPath)) {
    const fileList = fs.readdirSync(tagPath);
    if (fileList.length > 0) {
      std.warn(`There are some Files already exists in ${tagPath}`);
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
  } else {
    fs.mkdirSync(tagPath);
  }

  const template = await getTemplate();

  const loading = ora(`downloading ${template.name}`).start();

  return download(template.repo, tagPath, (err) => {
    if (err) {
      loading.stop();
      return std.error(`Fail to initial plugin ${pluginName}`, err);
    }

    loading.succeed(`download ${template.name} succeed`);

    updatePackage(pluginName, tagPath);

    initialWuCliJson(pluginName, tagPath);

    std.success(`Plugin ${pluginName} initial complete`);
  });
};