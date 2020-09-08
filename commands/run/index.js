const path = require('path');
const { std } = require('wu-utils');
const CONFIG = require('../../dict/common/CONFIG');
const getContext = require('../../utils/getContext');
const getExistPath = require('../../utils/getExistPath');
const validateConfig = require('../../utils/validateConfig');
const typeOf = require('../../utils/typeOf');

async function run(script, options, fnBeforeRun) {
  if (!script) {
    return std.error(`Missing required argument 'script' (wucli run [script])`);
  }

  const currentPath = process.cwd();

  const configPath = await getExistPath(path.resolve(currentPath, CONFIG.PROJECT_CONFIG));
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
}

module.exports = run;