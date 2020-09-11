const fs = require('fs');
const path = require('path');
const { std, fsExtra } = require('wu-utils');
const getPluginConfig = require('../../../utils/getPluginConfig');

module.exports = async function() {
	const wuCliJson = await getPluginConfig();

	if (wuCliJson) {
		const currentPath = process.cwd();
		const pluginsPath = path.resolve(__dirname, '../../../plugins');
		fsExtra.ensureDir(pluginsPath);
		const linkToPath = path.resolve(pluginsPath, wuCliJson.pluginName);

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
				return std.error(`Failed to link plugin ${wuCliJson.pluginName}`);
			}
			std.green.print(` LINK COMPLETED `);
		});
	}
};