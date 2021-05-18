const path = require('path');
const fs = require('fs');
const std = require('std-terminal-logger');
const chalk = require('chalk');
const { getHeyConfigName } = require('../../../utils/core');

module.exports = function (dirPath, type) {
  if (fs.existsSync(dirPath)) {
    const stats = fs.lstatSync(dirPath);
    if (stats.isDirectory()) {
      const fileList = fs.readdirSync(dirPath);
      if (fileList.length > 0) {
        std.amber(`  Local ${type} list:`);

        fileList.forEach((fileName) => {
          let tagPath = path.resolve(dirPath, fileName);
          const stats = fs.lstatSync(tagPath);
          if (stats.isSymbolicLink()) {
            tagPath = fs.readlinkSync(tagPath);
          }

          let tagVersion = '';
          const hyConfigPath = path.resolve(tagPath, getHeyConfigName(type));
          if (fs.existsSync(hyConfigPath)) {
            const stats = fs.lstatSync(hyConfigPath);
            if (stats.isFile()) {
              const cfg = require(hyConfigPath);
              tagVersion = cfg.version || '';
            }
          }

          std(`* ${chalk.keyword('lime')(fileName)} ${chalk.underline(tagVersion)} (${chalk.keyword('lightslategray')(tagPath)})`);
        });

        return;
      }
    }
  }

  std.orange.label(`no more local ${type}!`)();
};