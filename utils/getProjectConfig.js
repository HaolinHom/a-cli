const path = require('path');
const fs = require('fs');
const std = require('std-terminal-logger');
const {
  getPriorityPath,
  requireByType,
} = require('./common');
const CONFIG = require('../dict/common/CONFIG');

function validateConfig(cfg) {
  return !!cfg.name;
}

module.exports = function (cfgPath) {
  const currentPath = process.cwd();
  let projectConfigPath = getPriorityPath([
    path.join(currentPath, CONFIG.PROJECT_CONFIG),
    path.join(currentPath, CONFIG.PROJECT_CONFIG_JSON),
  ]);
  if (cfgPath && !fs.existsSync(cfgPath)) {
    projectConfigPath = undefined;
  }

  if (!projectConfigPath) {
    return std.error(`Can not find ${CONFIG.PROJECT_CONFIG} or ${CONFIG.PROJECT_CONFIG_JSON} in ${currentPath}`);
  }

  const projectConfig = requireByType(projectConfigPath, 'object');

  if (!projectConfig) {
    return std.error(`${CONFIG.PROJECT_CONFIG} is not a object`);
  }

  if (!validateConfig(projectConfig)) {
    return std.error(`${projectConfigPath} is a non-compliant file or missing the necessary fields.`);
  }

  return projectConfig;
};
