const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const std = require('std-terminal-logger');
const ora = require('ora');
const { prompt } = require('enquirer');
const typeOf = require('../../../utils/typeOf');
const CONFIG = require('../../../dict/common/CONFIG');
const getPluginConfig = require('../../../utils/getPluginConfig');

function checkNpmAuthToken() {
	const checking = ora('checking npm auth token...').start();
	let check = [];

	try {
		check = execSync('npm token --json', { encoding: 'utf8' });
		check = JSON.parse(check);
	} catch (e) {
		checking.stop();
		return false;
	}

	checking.stop();
	return check.length > 0;
}

async function updatePluginVersion() {
	const currentPath = process.cwd();
	const pluginCfgPath = path.resolve(currentPath, CONFIG.PLUGIN_CONFIG);

	const pluginCfg = require(pluginCfgPath);
	const { version } = await prompt({
		name: 'version',
		type: 'input',
		message: 'Please enter the plugin version to be published: ',
		initial: pluginCfg.pluginVersion,
	});
	pluginCfg.pluginVersion = version;

	fs.writeFileSync(pluginCfgPath, JSON.stringify(pluginCfg,null, 2), { encoding: 'utf8' });

	updateVersion(path.resolve(currentPath, 'package.json'), version);
	updateVersion(path.resolve(currentPath, 'package-lock.json'), version);
}

function updateVersion(filePath, version) {
	if (fs.existsSync(filePath)) {
		const tagFile = require(filePath);
		if (typeOf(tagFile) === 'object' && tagFile.version) {
      tagFile.version = version;
      fs.writeFileSync(filePath, JSON.stringify(tagFile,null, 2), { encoding: 'utf8' });
    }
	}
}

module.exports = async function() {
	const aCliJson = await getPluginConfig();
	if (aCliJson) {
		const isHadNpmAuthToken = checkNpmAuthToken();
		if (!isHadNpmAuthToken) {
			return std.error('Please login npm before plugin publish!');
		}

		await updatePluginVersion();

		const publishArgs = process.argv.slice(4);

		execSync(`npm publish ${publishArgs.join(' ')}`, { stdio: 'inherit' });
	}
};