const fs = require('fs');
const path = require('path');
const std = require('std-terminal-logger');
const {
  ensureDir,
  remove,
} = require('hey-yoo-utils/fsExtra');
const { getHeyConfig } = require('../../../utils/core');

module.exports = async function(outputPath, type) {
  type = type.toLowerCase();
	const config = await getHeyConfig(type);
	if (config) {
		const currentPath = process.cwd();
		ensureDir(outputPath);
		const linkToPath = path.resolve(outputPath, config.name);

		if (fs.existsSync(linkToPath)) {
			const lStats = fs.lstatSync(linkToPath);
			if (lStats.isSymbolicLink()) {
				fs.unlinkSync(linkToPath);
			} else {
				const stats = fs.statSync(linkToPath);
				if (stats.isDirectory() || stats.isFile()) {
					remove(linkToPath);
				}
			}
		}

		return fs.symlink(currentPath, linkToPath, 'junction', function(err) {
			if (err) {
				return std.error(`Failed to link ${type} ${config.name}`);
			}
			std.green.label(`${type.toUpperCase()} LINK COMPLETED`)();
		});
	}
};