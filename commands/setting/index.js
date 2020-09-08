const path = require('path');
const getExistPath = require('../../utils/getExistPath');
const open = require('open');
const { std } = require('wu-utils');

async function setting() {
  if (['-h', '--help'].includes(process.argv[3])) {
    const help = require('./help');
    return std.print(' SETTING HELP ', null, help);
  }
  const settingPath = await getExistPath(path.resolve(__dirname, '../../local/setting.json'));
  if (settingPath) {
    open(settingPath);
  }
}

module.exports = setting;
