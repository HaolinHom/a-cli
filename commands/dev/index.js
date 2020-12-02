const run = require('../run');

module.exports = function (options) {
  const debugInstallDependencies = true;
  const runOnSubProcess = true;
  run('dev', options, debugInstallDependencies, runOnSubProcess);
};