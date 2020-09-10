const run = require('../run');
const packageInstall = require('../../utils/packageInstall');
const typeOf = require('../../utils/typeOf');
const { prompt } = require('enquirer');
const PUBLISH = require('../../dict/command/PUBLISH');

async function publishOptionPrompt(options, target) {
	if (!Array.isArray(options) || options.length === 0) {
		return target;
	}

	const choices = options.map((opt) => {
		const type = typeOf(opt);
		if (type === 'string') {
			return opt;
		} else if (type === 'object' && opt.name) {
			return opt.name;
		} else {
			return null;
		}
	}).filter(opt => opt);
	const { key } = await prompt({
		name: 'key',
		type: 'select',
		message: PUBLISH.PROMPT.CHOICE_MODE_OPTION,
		choices,
	});
	target.keys.push(key);

	const tagOption = options.find(item => item.name === key || item === key);
	if (typeOf(tagOption) === 'object') {
		target.value = tagOption.value || target.value || null;
		return await publishOptionPrompt(tagOption.options, target);
	}

	return target;
}

async function fnBeforeRun(options, config) {
	let publishOptions = {};

	if (typeOf(config.publish) === 'object') {
		publishOptions.option = await publishOptionPrompt(config.publish.options, { keys: [], value: null });
		publishOptions.config = config.publish.config || null;
	}

	if (!options.debug) {
		packageInstall();
	}

	return { publishOptions };
}

function publish(options) {
  run('publish', options, fnBeforeRun);
}

module.exports = publish;