
const packs = require('./packs');
const run = require('./run');
const DESCRIPTION = require('../constants/dict/COMMANDS_DESCRIPTION');

module.exports = [
  {
    command: 'packs [command]',
    description: DESCRIPTION.PACKS,
    action: packs,
  },
  {
    command: 'run [script]',
    options: [
      ['-d, --debug', 'run customize command  with [debug] mode'],
      ['--preset [keys]', 'command preset key list'],
    ],
    description: DESCRIPTION.RUN,
    action: run,
  },
];