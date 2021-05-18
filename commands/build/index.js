const run = require('../run');

module.exports = function (options, commandObj) {
  const debugInstallDependencies = true;
  run('build', options, commandObj, debugInstallDependencies);
};