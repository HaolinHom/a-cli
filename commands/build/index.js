const run = require('../run');

module.exports = function (options) {
  const debugInstallDependencies = true;
  run('build', options, debugInstallDependencies);
};