const path = require('path');
const getExistPath = require('../../utils/getExistPath');
const open = require('open');

function setting() {
  const settingPath = path.resolve(__dirname, '../../local/setting.js');
  if (getExistPath(settingPath)) {
    open(settingPath);
  }
}

module.exports = setting;
