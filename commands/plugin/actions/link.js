const fs = require('fs');
const path = require('path');
const {
	std,
	fsExtra,
} = require('wu-utils');
const getPluginConfig = require('../../../utils/getPluginConfig');

module.exports = async function() {
	const wuCliJson = await getPluginConfig();

	if (wuCliJson) {
		const currentPath = process.cwd();
		const pluginsPath = path.resolve(__dirname, '../../../plugins');
		fsExtra.ensureDir(pluginsPath);
		const linkToPath = path.resolve(pluginsPath, wuCliJson.pluginName);

		if (fs.existsSync(linkToPath)) {
			const stats = fs.lstatSync(linkToPath);
			if (stats.isSymbolicLink()) {
				fs.unlinkSync(linkToPath);
			} else {
				// TODO: delete installed plugin
			}
		}

		return fs.symlink(currentPath, linkToPath, 'junction', function(err) {
			if (err) {
				return std.error(`failed to link plugin ${wuCliJson.pluginName}`);
			}
			std.green.print(` LINK COMPLETED `);
		});
	}
};