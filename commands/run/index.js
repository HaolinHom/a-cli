const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const std = require('std-terminal-logger');
const CONFIG = require('../../constants/common/CONFIG');
const run = require('./run');
const {
  getExistPath,
  getPriorityPath,
} = require('../../utils/common');
const {
  getProjectConfig,
  getPacksPath,
} = require('../../utils/core');

module.exports = async function (script, options, debugInstallDeps = false, runOnSubProcess = false) {
  if (!script) {
    return std.error(`Missing required argument 'script' (${CONFIG.BIN} run [script])`);
  }

  const isDebugMode = options.debug === true;
  const args = process.argv.slice(isDebugMode ? 4 : 3);

  const currentPath = process.cwd();
  const configPath = getPriorityPath(CONFIG.ALLOW_FORMAT.map(
    format => path.resolve(currentPath, `${CONFIG.CONFIG}.${format}`)
  ));


  const config = getProjectConfig(configPath);
  if (!config) {
    return;
  }

  const packsPath = await getPacksPath(config.name);
  if (!packsPath) {
    return std.error(`Packs(${config.name}) is not exist!`);
  }

  const packsJsPath = path.resolve(packsPath, `${script.toLowerCase()}.js`);
  const commandJsPath = getExistPath(packsJsPath);
  if (!commandJsPath) {
    return std.error(`${packsJsPath} is not exist`);
  }

  const installDeps = !isDebugMode && debugInstallDeps;
  const preset = typeof options.preset === 'string' ? options.preset.replace(/\s+/g, ',') : '';

  process.on('unhandledRejection', (error) => {
    if (error) {
      std.error(error);
    } else {
      std.orange.label('process exit')();
    }
  });

  if (runOnSubProcess) {
    const forkServerPath = path.resolve(__dirname, 'forkServer.js');

    const forkArguments = [
      forkServerPath,
      [
        `tagPath=${commandJsPath}`,
        `configPath=${configPath}`,
        `debug=${isDebugMode}`,
				`installDeps=${installDeps}`,
        `script=${script}`,
        `preset=${preset}`,
        ...args,
      ],
      { stdio: 'inherit' },
    ];

    let subProcess = fork(...forkArguments);

    subProcess.on('exit', (code, signal) => {
      if (code !== null || signal !== 'SIGKILL') {
        process.exit(0);
      }
    });

    fs.watchFile(configPath, () => {
      subProcess.kill('SIGKILL');
      subProcess = fork(...forkArguments);
      std.yellow(`Detected ${CONFIG.CONFIG} change, devServer restarting now.`);
    });
  } else {
    run(
      commandJsPath,
      configPath,
      args,
      {
        installDeps,
				script,
        preset: preset,
      }
    );
  }
};