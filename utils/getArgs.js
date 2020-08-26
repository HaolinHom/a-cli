/*
* @param {Array} args
* @return {Array}
* */
function getArgs(args = []) {
  let result = process.argv.slice(3);
  if (Array.isArray(args) && args.length > 0) {
    args = args.filter(arg => ['string', 'number'].includes(typeof arg));
    result = result.concat(args);
  }
  return result;
}

module.exports = getArgs;