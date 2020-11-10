const path = require('path');
const std = require('std-terminal-logger');
const getExistPath = require('./getExistPath');
const typeOf = require('./typeOf');
const CONFIG = require('../dict/common/CONFIG');

function validateConfig(cfg) {
  if (!cfg.name) {
    std.error('a-cli-config.json is a non-compliant file or missing the necessary fields');
    return false;
  }
  return true;
}

async function getProjectConfig(cfgPath) {
  const currentPath = process.cwd();
  const projectCfgPath = await getExistPath(cfgPath || path.resolve(currentPath, CONFIG.PROJECT_CONFIG));
  if (!projectCfgPath) {
    return std.error(`Can not find ${CONFIG.PROJECT_CONFIG} in ${currentPath}`);
  }

  const projectCfg = require(projectCfgPath);
  if (typeOf(projectCfg) === 'object') {
    return validateConfig(projectCfg) ? projectCfg : undefined;
  } else {
    return std.error(`${CONFIG.PROJECT_CONFIG} is not a json object`);
  }
}

module.exports = getProjectConfig;
