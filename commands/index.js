const init = require('./init');
const dev = require('./dev');
const run = require('./run');
const build = require('./build');
const publish = require('./publish');
const setting = require('./setting');
const plugin = require('./plugin');
const install = require('./install');
const DESCRIPTION = require('../dict/command/DESCRIPTION');

module.exports = [
	{
		command: 'init',
		description: DESCRIPTION.INIT,
		action: init,
	},
	{
		command: 'dev',
		options: [
			['-d, --debug', 'dev command with [debug] mode'],
			['--preset [keys]', 'command preset key list'],
		],
		description: DESCRIPTION.DEV,
		action: dev,
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
	{
		command: 'build',
		options: [
			['-d, --debug', 'build command with [debug] mode'],
			['--preset [keys]', 'command preset key list'],
		],
		description: DESCRIPTION.BUILD,
		action: build,
	},
	{
		command: 'publish',
		options: [
			['-d, --debug', 'publish command with [debug] mode'],
			['--preset [keys]', 'command preset key list'],
		],
		description: DESCRIPTION.PUBLISH,
		action: publish,
	},
	{
		command: 'setting',
		option: ['-h, --help', 'print setting help information'],
		description: DESCRIPTION.SETTING,
		action: setting,
	},
	{
		command: 'plugin [command]',
		description: DESCRIPTION.PLUGIN,
		action: plugin,
	},
	{
		command: 'install',
		options: [
			['-s, --save', 'npm install --save'],
			['-d, --dev', 'npm install --save-dev'],
		],
		description: DESCRIPTION.INSTALL,
		action: install,
	},
];