const run = require('../run');

module.exports = function (options, commandObj) {
  const debugInstallDependencies = true;
  const runOnSubProcess = true;
  run('dev', options, commandObj, debugInstallDependencies, runOnSubProcess);
};