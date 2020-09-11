const { execSync } = require('child_process');
const { prompt } = require('enquirer');
const getProjectConfig = require('../../utils/getProjectConfig');

const devDependencies = 'devDependencies';
const dependencies = 'dependencies';
const none = 'none';

const dependCfg = {
  [devDependencies]: ' --save-dev',
  [dependencies]: ' --save',
  [none]: '',
};

async function install(options) {
  const config = await getProjectConfig();
  if (!config) {
    return;
  }

  let depend = none;

  if (options.dev) {
    depend = devDependencies;
  } else if (options.save) {
    depend = dependencies;
  } else {
    const promptObj = await prompt({
      name: 'depend',
      type: 'select',
      message: 'Please choice mode option for plugin install action: ',
      choices: [devDependencies, dependencies, none],
      initial: 'devDependencies',
    });
    depend = promptObj.depend;
  }

  execSync(`npm install ${config.name}${dependCfg[depend]}`, { stdio: 'inherit' });
}

module.exports = install;
