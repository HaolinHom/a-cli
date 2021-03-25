const run = require('./run');
const { common } = require('hey-yoo-utils');

(async function () {
  const args = process.argv.slice(8);
  const options = common.parseArgs(process.argv);

  run(
    options.tagPath,
    options.configPath,
    args,
    {
      installDeps: options.installDeps,
      script: options.script,
      preset: options.preset,
    }
  );
})();