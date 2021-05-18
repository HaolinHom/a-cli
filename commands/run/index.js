const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const std= require('std-terminal-logger');
const CONFIG = require('../../dict/common/CONFIG');
const run = require('./run');
const getProjectConfig = require('../../utils/getProjectConfig');
const getPluginPath = require('../../utils/getPluginPath');
const getExistPath = require('../../utils/getExistPath');
const {
  getPriorityPath,
} = require('../../utils/common');

module.exports = async function (script, options, commandObj, debugInstallDeps = false, runOnSubProcess = false) {
  if (!script) {
    return std.error(`Missing required argument 'script' (acli run [script])`);
  }

  const isDebugMode = options.debug === true;
  const args = process.argv.slice(isDebugMode ? 4 : 3);

  const currentPath = process.cwd();
  const configPath = getPriorityPath([
    path.join(currentPath, CONFIG.PROJECT_CONFIG),
    path.join(currentPath, CONFIG.PROJECT_CONFIG_JSON),
  ]);

  const config = await getProjectConfig(configPath);
  if (!config) {
    return;
  }

  const pluginPath = await getPluginPath(config.name);
  if (!pluginPath) {
    return;
  }

  const commandJsPath = await getExistPath(path.resolve(pluginPath, `${script}.js`));
  if (!commandJsPath) {
    return;
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
      std.yellow('Detected a-cli-config.json change, devServer restarting now.');
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