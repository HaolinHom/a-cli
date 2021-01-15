const fs = require('fs');
const path = require('path');
const {
  pathExtra,
  fsExtra,
} = require('a-cli-utils');
const { requireByType } = require('./common');

function objectGenerateCjsFile (object, filePath) {
  let objectStr = JSON.stringify(object, null, 2);
  if (path.extname(filePath) === '.js') {
    objectStr = objectStr.replace(/"(\w*)":/g, function(match) {
      return match.replace(/"/g, '');
    });
    objectStr = `module.exports = ${objectStr};`;
  }

  fs.writeFileSync(filePath, objectStr, { encoding: 'utf8' });
}

module.exports.objectGenerateCjsFile = objectGenerateCjsFile;

module.exports.jsonFileTransformToCjsFile = function (jsonFilePath) {
  if (!fs.existsSync(jsonFilePath)) {
    return;
  }

  const json = requireByType(jsonFilePath, 'object');
  if (!json) {
    return;
  }

  objectGenerateCjsFile(json, `${pathExtra.removeExtname(jsonFilePath)}.js`);

  fsExtra.remove(jsonFilePath);
};