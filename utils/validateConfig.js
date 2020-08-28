const { std } = require('wu-utils');

// validate wu-cli-config
function validateConfig(cfg) {
  if (!cfg.name) {
    std.error('wu-cli-config.json must have [name] attribute!');
    return false;
  }
  return true;
}

module.exports = validateConfig;
