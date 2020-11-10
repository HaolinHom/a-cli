const path = require('path');
const std = require('std-terminal-logger');
const getExistPath = require('./getExistPath');
const typeOf = require('./typeOf');

function validateWuCliJson(aCliJson) {
	if (!aCliJson.pluginName || !aCliJson.pluginVersion) {
		std.error('a-cli.json is a non-compliant file or missing the necessary fields');
		return false;
	}
	return true;
}

async function getPluginConfig() {
	const currentPath = process.cwd();
	const aCliJsonPath = await getExistPath(path.resolve(currentPath, 'a-cli.json'));
	if (!aCliJsonPath) {
		return std.error(`Can not find a-cli.json in ${currentPath}`);
	}

	const aCliJson = require(aCliJsonPath);
	if (typeOf(aCliJson) === 'object') {
		return validateWuCliJson(aCliJson) ? aCliJson : undefined;
	} else {
		return std.error('a-cli.json is not a json object')
	}
}

module.exports = getPluginConfig;