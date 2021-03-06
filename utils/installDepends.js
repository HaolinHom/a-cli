const { execSync } = require('child_process');
const std = require('std-terminal-logger');

function installDepends(depends, isDevDepend = true, options) {
	std.white(`${depends} installing...`);

	execSync(`npm install ${depends} --save${isDevDepend ? '-dev' : ''}`, options);

	std.green(`${depends} install completed`);
}

module.exports = installDepends;