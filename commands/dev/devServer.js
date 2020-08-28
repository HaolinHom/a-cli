const { std, parseArgs } = require('wu-utils');
const getContext = require('../../utils/getContext');

(async function () {
  const argObj = parseArgs(process.argv.slice(2));

  const devJs = require(argObj.tagPath);

  if (typeof devJs === 'function') {
    devJs(getContext(), process.argv.slice(3));
  } else {
    std.error('Can not find command implement script');
    throw new Error('Can not find command implement script');
  }
})();