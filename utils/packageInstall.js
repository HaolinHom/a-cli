const { execSync } = require('child_process');
const { std } = require('wu-utils');

function packageInstall(options) {
  std.info('packages installing...');

  execSync('npm install', options);

  std.success('packages install completed');
}

module.exports = packageInstall;