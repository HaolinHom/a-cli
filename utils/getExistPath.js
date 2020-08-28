const fs = require('fs');
const { std } = require('wu-utils');

/*
* @param {string} path
* @return {string}
* */
function getExistPath(path) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      resolve(path);
    } else {
      std.error(`${path} is not exist!`);
      reject('');
    }
  });
}

module.exports = getExistPath;