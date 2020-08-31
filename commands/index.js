const init = require('./init');
const dev = require('./dev');
const run = require('./run');
const build = require('./build');

module.exports = [
	{
		command: 'init',
		description: 'initial project with wu-cli-config and wu-cli-template',
		action: init,
	},
	{
		command: 'dev',
		options: [
			['-d, --debug', 'dev command with [debug] mode'],
		],
		description: 'develop project with wu-cli-config',
		action: dev,
	},
	{
		command: 'run [script]',
		options: [
			['-d, --debug', 'run customize command  with [debug] mode'],
		],
		description: 'run customize command',
		action: run,
	},
	{
		command: 'build',
		options: [
			['-d, --debug', 'build command with [debug] mode'],
		],
		description: 'build project with wu-cli-config',
		action: build,
	},
];