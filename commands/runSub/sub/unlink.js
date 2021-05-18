const fs = require('fs');
const path = require('path');
const std = require('std-terminal-logger');
const { getHeyConfig } = require('../../../utils/core');

module.exports = async function (tagPath, type) {
  const config = await getHeyConfig(type);
  if (config) {
    const pluginPath = path.resolve(tagPath, config.name);
    if (fs.existsSync(pluginPath)) {
      const stats = fs.lstatSync(pluginPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(pluginPath);
        std.green.label(`${type.toUpperCase()} UNLINK COMPLETED`)();
      }
    } else {
      std.warn(`No ${type} ${config.name} need to unlink`)
    }
  }
};