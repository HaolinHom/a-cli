const process = require('process');
const path = require('path');
const fs = require('fs');
const { std } = require('wu-utils');
const { prompt } = require('enquirer');
const ora = require('ora');
const download = require('download-git-repo');

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

  const loading = ora('downloading wu-cli-template').start();

  return download(
    'wu-node/wu-cli-template',
    tagPath,
    (err) => {
      if (err) {
        loading.stop();
        return std.error(`Fail to initial ${tagDirName}: `, err);
      }

      loading.succeed('download wu-cli-template succeed');

      fs.writeFileSync(
        path.resolve(currentPath, 'wu-cli-config.json'),
`{
  "name": "${tagDirName}"
}`,
        { encoding: 'utf8' }
        );

      std.success(`Finish ${tagDirName} initial`);
    }
  );
}

module.exports = init;