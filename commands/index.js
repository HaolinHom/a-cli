const init = require('./init');

module.exports = [
	{
		command: 'init',
		description: 'initial [project] with (wu.json and wu-config directory)',
		action: init,
	},
];