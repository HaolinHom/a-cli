const run = require('./run');
const { parseArgs } = require('a-cli-utils');

(async function () {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  run(
    options.tagPath,
    options.configPath,
    args,
    {
      installDeps: options.installDeps,
      presetSwitch: options.presetSwitch,
    }
  );
})();