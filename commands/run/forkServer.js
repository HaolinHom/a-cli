const run = require('./run');
const { parseArgs } = require('a-cli-utils');

(async function () {
  const args = process.argv.slice(8);
  const options = parseArgs(process.argv);

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