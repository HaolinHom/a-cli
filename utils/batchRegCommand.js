function runProgramMethod(program, key, args) {
	if (Array.isArray(args)) {
		return program[key](...args);
	} else {
		return program[key](args);
	}
}

/**
 * @param {Object} program (Command object's instance. Create by commander package)
 * @param {Array} list (command config list)
 * */
function batchRegCommand(program, list) {
	list.forEach((cfg) => {
		let moduleSource = cfg.source || null;
		delete cfg.source;
		const keys = Object.keys(cfg);
		let _program = program;
		keys.forEach((key) => {
			if (key === 'options' && Array.isArray(cfg[key])) {
				cfg[key].forEach((opt) => {
					_program = runProgramMethod(_program, 'option', opt);
				});
			} else {
				_program = runProgramMethod(_program, key, cfg[key]);
			}
		});
		if (!cfg.action && moduleSource) {
			let tempModule = require(moduleSource);
			tempOne.action(tempModule);
		}
	});
}

module.exports = batchRegCommand;