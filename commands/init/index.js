const path = require('path');
const fs = require('fs');
const { std } = require('wu-utils');
const { prompt } = require('enquirer');
const ora = require('ora');
const download = require('download-git-repo');
const CONFIG = require('../../dict/common/CONFIG');
const getExistPath = require('../../utils/getExistPath');
const typeOf = require('../../utils/typeOf');

function templateFilter(item) {
  return (
    item.name && typeof item.name === 'string'
    &&
    item.repo && typeof item.repo === 'string'
  );
}

async function getTemplateRepo(defaultTemplate = CONFIG.DEFAULT_TEMPLATE) {
  const settingPath = path.resolve(__dirname, '../../local/setting.json');

  if (getExistPath(settingPath)) {
    const setting = require(settingPath);
    if (typeOf(setting) === 'object' && Array.isArray(setting.templates)) {
      let _templates = setting.templates.filter(templateFilter);
      const len = _templates.length;
      if (len > 1) {
        const { templateName } = await prompt({
          name: 'templateName',
          type: 'select',
          message: 'Please select the cli template that you want:',
          choices: _templates.map(item => item.name),
        });
        return _templates.find(item => item.name === templateName).repo;
      } else if (len === 1) {
        return _templates[0].repo;
      }
    }
  }

  return defaultTemplate.repo;
}

async function init() {
	const currentPath = process.cwd();
	const tagDirName = `${path.basename(currentPath)}-cli`;
  const { directory } = await prompt({
    name: 'directory',
    type: 'input',
    message: 'Please input the cli directory name:',
    initial: tagDirName,
  });
  const tagPath = path.resolve(currentPath, directory);
  const tagCfgPath = path.resolve(currentPath, 'wu-cli-config.json');

  if (fs.existsSync(tagCfgPath) && fs.existsSync(tagPath)) {
    const fileList = fs.readdirSync(tagPath);
    if (fileList.length > 0) {
      std.warn(`There are some File already exists in ${tagPath}`);
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
  } else {
    fs.mkdirSync(tagPath);
  }

  const repo = await getTemplateRepo();

  const loading = ora('downloading wu-cli-template').start();

  return download(repo, tagPath, (err) => {
    if (err) {
      loading.stop();
      return std.error(`Fail to initial ${tagDirName}: `, err);
    }

    loading.succeed('download wu-cli-template succeed');

    fs.writeFileSync(
      path.resolve(currentPath, 'wu-cli-config.json'),
`{
  "name": "${tagDirName}",
  "publish": {
  	"options": [],
  	"config": null
  }
}`,
      { encoding: 'utf8' }
    );

    std.success(`Finish ${tagDirName} initial`);
  });
}

module.exports = init;