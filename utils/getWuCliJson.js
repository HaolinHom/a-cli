const path = require('path');
const { std } = require('wu-utils');
const getExistPath = require('./getExistPath');
const typeOf = require('./typeOf');

function validateWuCliJson(wuCliJson) {
	if (!wuCliJson.pluginName || !wuCliJson.pluginVersion) {
		std.error('wu-cli.json is a non-compliant file or missing the necessary fields');
		return false;
	}
	return true;
}

async function getWuCliJson() {
	const currentPath = process.cwd();
	const wuCliJsonPath = await getExistPath(path.resolve(currentPath, 'wu-cli.json'));
	if (!wuCliJsonPath) {
		return std.error(`Can not find wu-cli.json in ${currentPath}`);
	}

	const wuCliJson = require(wuCliJsonPath);
	if (typeOf(wuCliJson) === 'object') {
		return validateWuCliJson(wuCliJson) ? wuCliJson : undefined;
	} else {
		return std.error('wu-cli.json is not a json object')
	}
}

module.exports = getWuCliJson;