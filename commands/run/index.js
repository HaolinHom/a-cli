const path = require('path');
const { std } = require('wu-utils');
const CONFIG = require('../../dict/common/CONFIG');
const getContext = require('../../utils/getContext');
const getExistPath = require('../../utils/getExistPath');
const validateConfig = require('../../utils/validateConfig');

async function run(script, options, fnBeforeRun) {
  if (!script) {
    return std.error(`Missing required argument 'script' (wucli run [script])`);
  }

  const currentPath = process.cwd();

  const configPath = await getExistPath(path.resolve(currentPath, CONFIG.WU_CLI_CONFIG));
  if (!configPath) {
    return;
  }

  const config = require(configPath);
  if (!validateConfig(config)) {
    return;
  }

  const tagJsPath = await getExistPath(path.resolve(currentPath, `${config.name}/${script}.js`));

  if (tagJsPath) {
    const runJs = require(tagJsPath);

    if (typeof runJs === 'function') {
      if (fnBeforeRun && typeof fnBeforeRun === 'function') {
        await fnBeforeRun(options, config);
      }
      runJs(getContext({ config }), process.argv.slice(4));
    } else {
      std.error('Can not find command implement script');
      throw new Error('Can not find command implement script');
    }
  }
}

module.exports = run;