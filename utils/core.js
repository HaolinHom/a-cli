const path = require('path');
const fs = require('fs');
const std = require('std-terminal-logger');
const chalk = require('chalk');
const prompts = require('prompts');
const {
  parseArgs,
} = require('hey-yoo-utils/common');
const {
  getPriorityPath,
  requireByType,
} = require('./common');
const {
  validateConfig,
  validateHeyConfig,
} = require('./validate');
const CONFIG = require('../constants/common/CONFIG');

function runProgramMethod(program, key, args) {
  if (Array.isArray(args)) {
    return program[key](...args);
  } else {
    return program[key](args);
  }
}

/**
 * @param {Object} program (Command object's instance. Create by commander.js)
 * @param {Array} list (command config list)
 * */
module.exports.batchRegCommand = function (program, list) {
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
};

/*
* @param {Object} ctx
* @return {Object}
* */
module.exports.getContext = function (ctx) {
  let context = {
    utils: {
      std,
      parseArgs,
    },
    packages: {
      chalk,
      prompts,
    },
  };
  if (typeof ctx === 'object') {
    if (ctx.utils && typeof ctx.utils === 'object') {
      context.utils = {
        ...ctx.utils,
        ...context.utils,
      };
      delete ctx.utils;
    }
    if (ctx.packages && typeof ctx.packages === 'object') {
      context.packages = {
        ...ctx.packages,
        ...context.packages,
      };
      delete ctx.packages;
    }
    context = {
      ...ctx,
      ...context,
    };
  }
  return context;
};

/*
* get hey.config in project
* */
function getProjectConfig() {
  const currentPath = process.cwd();
  const configPath = getPriorityPath(CONFIG.ALLOW_FORMAT.map(
    format => path.resolve(currentPath, `${CONFIG.CONFIG}.${format}`)
  ));
  if (!configPath) {
    return std.error(`Can not find ${
      CONFIG.ALLOW_FORMAT.map(format => `${CONFIG.CONFIG}.${format}`).join(` or `)
    } in ${currentPath}`);
  }

  const config = requireByType(configPath, 'object');
  if (!config) {
    return std.error(`${configPath} is not a object`);
  }

  if (!validateConfig(config, configPath)) {
    return;
  }

  return config;
}
module.exports.getProjectConfig = getProjectConfig;

module.exports.getPacksPath = function (packsName) {
  if (!packsName) {
    throw new Error(chalk.redBright('Missing required parameters[name] in getPacksPath()!'));
  }
  if (typeof packsName !== 'string') {
    throw new Error(chalk.redBright('The parameter must be a string in getPacksPath()!'));
  }

  // prefer to use the packs in the local/packs directory, convenient to develop and debug plugins
  let packsPath = path.resolve(__dirname, `../${CONFIG.LOCAL_PACKS_BASE}/${packsName}`);
  if (!fs.existsSync(packsPath)) {
    packsPath = path.resolve(process.cwd(), `node_modules/${packsName}`);
    if (!fs.existsSync(packsPath)) {
      return null;
    }
  }

  const stats = fs.statSync(packsPath);
  if (stats.isDirectory()) {
    return packsPath;
  }

  const lStats = fs.lstatSync(packsPath);
  if (lStats.isSymbolicLink()) {
    return fs.readlinkSync(packsPath);
  }

  return  null;
};

function getHeyConfigName(type) {
  switch (type) {
    case CONFIG.TYPE_PACKS:
      return CONFIG.PACKS_CONFIG;
    case CONFIG.TYPE_PLUGINS:
      return CONFIG.PLUGINS_CONFIG;
    default:
      throw new Error(`Error: getHeyConfig's parameter type(${type}) is invalid!`);
  }
}
module.exports.getHeyConfigName = getHeyConfigName;

/*
* get hey.packs.config or hey.plugins.config
* */
module.exports.getHeyConfig = function (type) {
  const currentPath = process.cwd();

  const configPath = getPriorityPath(CONFIG.ALLOW_FORMAT.map(
    format => path.resolve(currentPath, `${getHeyConfigName(type)}.${format}`)
  ));
  if (!configPath) {
    return std.error(`Can not find ${CONFIG.HY_CONFIG}!`);
  }

  const config = requireByType(configPath, 'object');
  if (!config) {
    return std.error(`${configPath} is not a object`);
  }

  return validateHeyConfig(config, getHeyConfigName(type)) ? config : null;
};

module.exports.getRegisterList = async function () {
  const currentPath = process.cwd();
  const configPath = getPriorityPath(CONFIG.ALLOW_FORMAT.map(
    format => path.resolve(currentPath, `${CONFIG.CONFIG}.${format}`)
  ));


  const config = getProjectConfig(configPath);
  if (!config) {
    return;
  }

  const packsPath = await getPacksPath(config.name);
  if (!packsPath) {
    return std.error(`Packs(${config.name}) is not exist!`);
  }
};