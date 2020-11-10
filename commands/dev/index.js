const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');
const std = require('std-terminal-logger');
const getProjectConfig = require('../../utils/getProjectConfig');
const getPluginPath = require('../../utils/getPluginPath');
const packageInstall = require('../../utils/packageInstall');
const getExistPath = require('../../utils/getExistPath');
const CONFIG = require('../../dict/common/CONFIG');

async function dev(options) {
  const isDebugMode = options.debug === true;
  const configPath = path.resolve(process.cwd(), CONFIG.PROJECT_CONFIG);

  const config = await getProjectConfig(configPath);
  if (!config) {
    return;
  }

  const pluginPath = await getPluginPath(config.name);
  if (!pluginPath) {
    return;
  }

  const commandJsPath = await getExistPath(path.resolve(pluginPath, 'dev.js'));
  if (!commandJsPath) {
    return;
  }

  const devServerPath = path.resolve(__dirname, 'devServer.js');
  if (!isDebugMode) {
    packageInstall();
  }

  const devArguments = [
    devServerPath,
    [ `tagPath=${commandJsPath}`, `configPath=${configPath}`, `debug=${isDebugMode}` ],
    { stdio: 'inherit' },
  ];

  let devProcess = fork(...devArguments);

  devProcess.on('exit', (data) => {
    process.exit(0);
  });

  fs.watchFile(configPath, () => {
    std.yellow('Detected a-cli-config.json change, devServer restarting now.');
    devProcess.kill();
    devProcess = fork(...devArguments);
  });
}

module.exports = dev;