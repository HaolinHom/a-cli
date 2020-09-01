const run = require('../run');
const packageInstall = require('../../utils/packageInstall');

function fnBeforeRun(options, config) {
  if (!options.debug) {
    packageInstall();
  }
}

function build(options) {
  run('build', options, fnBeforeRun);
}

module.exports = build;