const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { std } = require('wu-utils');
const ora = require('ora');
const { prompt } = require('enquirer');
const CONFIG = require('../../../dict/common/CONFIG');

function checkNpmAuthToken() {
	const checking = ora('checking npm auth token...').start();
	let check = false;

	let npmCfg = execSync('npm config list --json', { encoding: 'utf8' });
	npmCfg = JSON.parse(npmCfg);

	const npmrcPath = npmCfg.userconfig;
	if (npmrcPath && fs.existsSync(npmrcPath)) {
		const npmrc = fs.readFileSync(npmrcPath, { encoding: 'utf8' });

		let tokenList = execSync('npm token --json', { encoding: 'utf8' });
		tokenList = JSON.parse(tokenList)

		check = tokenList.some(item => new RegExp(`_authToken=${item.token}`).test(npmrc));
	}

	checking.stop();
	return check;
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
		tagFile.version = version;
		fs.writeFileSync(filePath, JSON.stringify(tagFile,null, 2), { encoding: 'utf8' });
	}
}

module.exports = async function() {
	const isHadNpmAuthToken = checkNpmAuthToken();
	if (!isHadNpmAuthToken) {
		return std.error('Please login npm before plugin publish!');
	}

	await updatePluginVersion();

	const publishArgs = process.argv.slice(4);

	execSync(`npm publish ${publishArgs.join(' ')}`, { stdio: 'inherit' });
};