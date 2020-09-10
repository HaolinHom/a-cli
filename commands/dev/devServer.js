const { std, parseArgs } = require('wu-utils');
const getContext = require('../../utils/getContext');

(async function () {
  const args = process.argv.slice(2);
  const argObj = parseArgs(args);

  const devJs = require(argObj.tagPath);

  if (typeof devJs === 'function') {
    const config = require(argObj.configPath);

    devJs(getContext({ config }), args);
  } else {
    std.error('Can not find command implement script');
    throw new Error('Can not find command implement script');
  }
})();