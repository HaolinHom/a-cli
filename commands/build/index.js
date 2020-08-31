const run = require('../run');

function build(options) {
  const isNeedPackageInstall = true;
  run('build', options, isNeedPackageInstall);
}

module.exports = build;