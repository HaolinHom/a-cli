const { std, parseArgs } = require('wu-utils');
const getContext = require('../../utils/getContext');
const DEV = require('../../dict/command/DEV');

(async function () {
  const args = process.argv.slice(2);
  const argObj = parseArgs(args);

  const devJs = require(argObj.tagPath);

  if (typeof devJs === 'function') {
    const config = require(argObj.configPath);

    devJs(getContext({ config }), args);
  } else {
    std.error(DEV.ERROR.NOT_FOUND_SCRIPT);
    throw new Error(DEV.ERROR.NOT_FOUND_SCRIPT);
  }
})();