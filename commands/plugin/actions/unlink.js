const fs = require('fs');
const path = require('path');
const std = require('std-terminal-logger');
const getPluginConfig = require('../../../utils/getPluginConfig');

module.exports = async function () {
  const aCliJson = await getPluginConfig();

  if (aCliJson) {
    const pluginPath = path.resolve(__dirname, `../../../plugins/${aCliJson.pluginName}`);
    if (fs.existsSync(pluginPath)) {
      const stats = fs.lstatSync(pluginPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(pluginPath);
        std.green.label('UNLINK COMPLETED')();
      }
    } else {
      std.warn(`No plugin ${aCliJson.pluginName} need to unlink`)
    }
  }
};