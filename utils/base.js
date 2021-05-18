const { execSync } = require('child_process');
const ora = require('ora');

module.exports.installDependencies = function (options) {
  const loading = ora('Installing dependencies').start();

  execSync('npm install', options);

  loading.succeed(`install completed`);
};
