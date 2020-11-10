const fs = require('fs');
const path = require('path');
const { fsExtra } = require('wu-utils');
const std = require('std-terminal-logger');
const getPluginConfig = require('../../../utils/getPluginConfig');

module.exports = async function() {
	const aCliJson = await getPluginConfig();

	if (aCliJson) {
		const currentPath = process.cwd();
		const pluginsPath = path.resolve(__dirname, '../../../plugins');
		fsExtra.ensureDir(pluginsPath);
		const linkToPath = path.resolve(pluginsPath, aCliJson.pluginName);

		if (fs.existsSync(linkToPath)) {
			const lStats = fs.lstatSync(linkToPath);
			if (lStats.isSymbolicLink()) {
				fs.unlinkSync(linkToPath);
			} else {
				const stats = fs.statSync(linkToPath);
				if (stats.isDirectory() || stats.isFile()) {
					fsExtra.remove(linkToPath);
				}
			}
		}

		return fs.symlink(currentPath, linkToPath, 'junction', function(err) {
			if (err) {
				return std.error(`Failed to link plugin ${aCliJson.pluginName}`);
			}
			std.green.label('LINK COMPLETED')();
		});
	}
};