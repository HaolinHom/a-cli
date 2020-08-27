const init = require('./init');
const dev = require('./dev');
const run = require('./run');

module.exports = [
	{
		command: 'init',
		description: 'initial project with wu-cli-config and wu-cli-template',
		action: init,
	},
	{
		command: 'dev',
		option: ['-d, --debug', 'dev command with [debug] mode'],
		description: 'develop project with wu-cli-config and wu-cli-template',
		action: dev,
	},
	{
		command: 'run',
		description: 'run customize command',
		action: run,
	},
];