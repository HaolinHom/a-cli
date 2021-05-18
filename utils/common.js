const fs = require('fs');
const { typeOf } = require('hey-yoo-utils/common');

module.exports.getPriorityPath = function (pathList) {
  if (!Array.isArray(pathList) || pathList.length === 0) {
    return;
  }
  let priority;
  for (let i = 0; i < pathList.length; i++) {
    if (fs.existsSync(pathList[i])) {
      priority = pathList[i];
      break;
    }
  }
  return priority;
};

module.exports.requireByType = function (tagPath, type) {
  let tag;
  try {
    tag = require(tagPath);
  } catch (e) {
    tag = undefined;
  }
  if (type) {
    return typeOf(tag) === type ? tag : undefined;
  }
  return tag;
};

module.exports.getExistPath = function (path) {
  return fs.existsSync(path) ? path : null;
};