const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const std= require('std-terminal-logger');
const CONFIG = require('../../dict/common/CONFIG');
const run = require('./run');
const getProjectConfig = require('../../utils/getProjectConfig');
const getPluginPath = require('../../utils/getPluginPath');
const getExistPath = require('../../utils/getExistPath');

module.exports = async function (script, options, debugInstallDeps = false, runOnSubProcess = false) {
  if (!script) {
    return std.error(`Missing required argument 'script' (acli run [script])`);
  }

  const isDebugMode = options.debug === true;
  const configPath = path.resolve(process.cwd(), CONFIG.PROJECT_CONFIG);

  const config = await getProjectConfig();
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

  let preRunPath = path.resolve(__dirname, `../${script}/preRun.js`);
  preRunPath = fs.existsSync(preRunPath) ? preRunPath : null;

  const installDeps = !isDebugMode && debugInstallDeps;
  const presetSwitch = ((config.preset || {}).switch || {})[script] || false;

  if (runOnSubProcess) {
    const forkServerPath = path.resolve(__dirname, 'forkServer.js');

    const forkArguments = [
      forkServerPath,
      [
        `tagPath=${commandJsPath}`,
        `preRunPath=${preRunPath}`,
        `configPath=${configPath}`,
        `debug=${isDebugMode}`,
        `presetSwitch=${presetSwitch}`,
        `installDeps=${installDeps}`,
      ],
      { stdio: 'inherit' },
    ];

    let subProcess = fork(...forkArguments);

    subProcess.on('exit', (data) => {
      process.exit(0);
    });

    fs.watchFile(configPath, () => {
      std.yellow('Detected a-cli-config.json change, devServer restarting now.');
      subProcess.kill();
      subProcess = fork(...forkArguments);
    });
  } else {
    run(
      commandJsPath,
      configPath,
      process.argv.slice(4),
      {
        installDeps,
        presetSwitch,
      }
    );
  }
};