const fs = require('fs');
const path = require('path');
const { std } = require('wu-utils');
const getPluginConfig = require('../../../utils/getPluginConfig');

module.exports = async function () {
  const wuCliJson = await getPluginConfig();

  if (wuCliJson) {
    const pluginPath = path.resolve(__dirname, `../../../plugins/${wuCliJson.pluginName}`);
    if (fs.existsSync(pluginPath)) {
      const stats = fs.lstatSync(pluginPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(pluginPath);
        std.green.print(` UNLINK COMPLETED `);
      }
    } else {
      std.warn(`No plugin ${wuCliJson.pluginName} need to unlink`)
    }
  }
};