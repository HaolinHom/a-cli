const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');
const { std } = require('wu-utils');
const packageInstall = require('../../utils/packageInstall');
const getExistPath = require('../../utils/getExistPath');
const validateConfig = require('../../utils/validateConfig');
const CONFIG = require('../../dict/common/CONFIG');

async function dev(command) {
  const isDebugMode = command.debug === true;
  const currentPath = process.cwd();

  const configPath = await getExistPath(path.resolve(currentPath, CONFIG.WU_CLI_CONFIG));
  if (!configPath) {
    return;
  }

  const config = require(configPath);
  if (!validateConfig(config)) {
    return;
  }

  const commandJsPath = await getExistPath(path.resolve(currentPath, `${config.name}/dev.js`));
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
    std.info('Detected wu-cli-config.json change, devServer restarting now.');
    devProcess.kill();
    devProcess = fork(...devArguments);
  });
}

module.exports = dev;