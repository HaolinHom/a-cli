const path = require('path');
const std= require('std-terminal-logger');
const getProjectConfig = require('../../utils/getProjectConfig');
const getPluginPath = require('../../utils/getPluginPath');
const getContext = require('../../utils/getContext');
const getExistPath = require('../../utils/getExistPath');
const typeOf = require('../../utils/typeOf');

async function run(script, options, fnBeforeRun) {
  if (!script) {
    return std.error(`Missing required argument 'script' (wucli run [script])`);
  }

  const config = await getProjectConfig();
  if (!config) {
    return;
  }

  const pluginPath = await getPluginPath(config.name);
  if (!pluginPath) {
    return;
  }

  const tagJsPath = await getExistPath(path.resolve(pluginPath, `${script}.js`));
  if (!tagJsPath) {
    return;
  }

  const runJs = require(tagJsPath);
  if (typeof runJs === 'function') {
    let ctx = { config };
    if (fnBeforeRun && typeof fnBeforeRun === 'function') {
      const ctxExtend = await fnBeforeRun(options, config);
      if (typeOf(ctxExtend) === 'object') {
        ctx = { ...ctxExtend, config };
      }
    }
    runJs(getContext(ctx), process.argv.slice(4));
  } else {
    std.error('Can not find command implement script');
    throw new Error('Can not find command implement script');
  }
}

module.exports = run;