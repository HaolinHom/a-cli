#!/usr/bin/env node

'use strict';

const { Command } = require('commander');
const { batchRegCommand } = require('wu-utils');
const packageJson = require('./package.json');
const cliCommands = require('./commands');

const program = new Command();

program
	.version(packageJson.version)
	.description(packageJson.description);

if (cliCommands.length > 0) {
	batchRegCommand(program, cliCommands);
}

program.parse(process.argv);