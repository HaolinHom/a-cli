const path = require('path');
const { fsExtra }  = require('a-cli-utils');
const CONFIG = require('../../dict/common/CONFIG');
const { getPriorityPath } = require('../../utils/common');
const {
  objectGenerateCjsFile,
  jsonFileTransformToCjsFile,
}  = require('../../utils/cjsFile');

function getExistSettingPath () {
  const localPath = path.resolve(__dirname, '../../local');
  fsExtra.ensureDir(localPath);

  const defaultSettingPath = path.join(localPath, CONFIG.DEFAULT_SETTING);
  const oldSettingPath = path.join(localPath, CONFIG.DEFAULT_SETTING_JSON);

  let settingPath = getPriorityPath([defaultSettingPath, oldSettingPath]);

  if (!settingPath) {
    const defaultSetting = require('../../dict/common/DEFAULT_SETTING');
    objectGenerateCjsFile(defaultSetting, defaultSettingPath);
  } else if (settingPath === oldSettingPath) {
    // Can be deleted in the future
    jsonFileTransformToCjsFile(oldSettingPath);
  }

  // TODO: Verify setting

  return defaultSettingPath;
}

module.exports.getSettingPath = getExistSettingPath;

module.exports.getSetting = function () {
  const settingPath = getExistSettingPath();

  return require(settingPath);
};