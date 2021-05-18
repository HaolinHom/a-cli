const run = require('./run');
const { common } = require('hey-yoo-utils');
const std = require('std-terminal-logger');

(async function () {
  const args = process.argv.slice(8);
  const options = common.parseArgs(process.argv);

  process.on('unhandledRejection', (error) => {
    if (error) {
      std.error(error);
    } else {
      std.orange.label('process exit')();
    }
  });

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