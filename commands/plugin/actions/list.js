const path = require('path');
const fs = require('fs');
const std = require('std-terminal-logger');
const chalk = require('chalk');
const CONFIG = require('../../../dict/common/CONFIG');

module.exports = function () {
  const pluginsPath = path.resolve(__dirname, '../../../plugins');

  if (fs.existsSync(pluginsPath)) {
    const stats = fs.lstatSync(pluginsPath);
    if (stats.isDirectory()) {
      const fileList = fs.readdirSync(pluginsPath);
      if (fileList.length > 0) {
        std.amber(`  Local plugin list:`);

        fileList.forEach((fileName) => {
          let tagPath = path.resolve(pluginsPath, fileName);
          const stats = fs.lstatSync(tagPath);
          if (stats.isSymbolicLink()) {
            tagPath = fs.readlinkSync(tagPath);
          }

          let tagVersion = '';
          const pluginConfigPath = path.resolve(tagPath, CONFIG.PLUGIN_CONFIG);
          if (fs.existsSync(pluginConfigPath)) {
            const stats = fs.lstatSync(pluginConfigPath);
            if (stats.isFile()) {
              const cfg = require(pluginConfigPath);
              tagVersion = cfg.pluginVersion || '';
            }
          }

          std(`* ${chalk.keyword('lime')(fileName)} ${chalk.underline(tagVersion)} (${chalk.keyword('lightslategray')(tagPath)})`);
        });

        return;
      }
    }
  }

  std.orange.label('no more local plugins!')();
};