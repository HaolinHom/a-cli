#!/usr/bin/env node

'use strict';

const { Command } = require('commander');
const { batchRegCommand } = require('wu-utils');
const chalk = require('chalk');
const packageJson = require('./package.json');
const cliCommands = require('./commands');

const program = new Command();

program
	.name('wucli')
	.version(packageJson.version)
	.usage(chalk.greenBright('[command]'))
	.description(packageJson.description);

if (cliCommands.length > 0) {
	batchRegCommand(program, cliCommands);
}

program.parse(process.argv);