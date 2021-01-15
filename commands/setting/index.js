const open = require('open');
const settingUtils = require('./utils');

async function setting() {
  const settingPath = settingUtils.getSettingPath();
  if (settingPath) {
    open(settingPath);
  }
}

module.exports = setting;
