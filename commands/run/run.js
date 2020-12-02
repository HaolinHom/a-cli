const std = require('std-terminal-logger');
const { prompt } = require('enquirer');
const typeOf = require('../../utils/typeOf');
const getContext = require('../../utils/getContext');
const packageInstall = require('../../utils/packageInstall');

async function presetOptionPrompt(options, target) {
  if (!Array.isArray(options) || options.length === 0) {
    return target;
  }

  const choices = options.map((opt) => {
    const type = typeOf(opt);
    if (type === 'string') {
      return opt;
    } else if (type === 'object' && opt.name) {
      return opt.name;
    } else {
      return null;
    }
  }).filter(opt => opt);
  const { key } = await prompt({
    name: 'key',
    type: 'select',
    message: 'Please choice preset option for project:',
    choices,
  });
  target.keys.push(key);

  const tagOption = options.find(item => item.name === key || item === key);
  if (typeOf(tagOption) === 'object') {
    target.value = tagOption.value || target.value || null;
    return await presetOptionPrompt(tagOption.options, target);
  }

  return target;
}

async function getPreset(options, define) {
  let preset = {
    option: {
      keys: [],
      value: null,
    },
    define: define || null,
  };

  preset.option = await presetOptionPrompt(options, preset.option);

  return { preset };
}

const defaultOpts = {
  installDeps: false,
  presetSwitch: false,
};

module.exports = async function (tagJsPath, cfgPath, args, options = defaultOpts) {
  const tagJs = require(tagJsPath);
  if (typeof tagJs === 'function') {

    const config = require(cfgPath);
    let ctx = { config };

    if (options.installDeps) {
      packageInstall();
    }

    if (options.presetSwitch) {
      const ctxExtend = await getPreset(config.preset.options, config.preset.define);
      if (typeOf(ctxExtend) === 'object') {
        ctx = {
          ...ctxExtend,
          config,
        };
      }
    }

    tagJs(getContext(ctx), args);
  } else {
    std.error('Can not find command implement script');
    throw new Error('Can not find command implement script');
  }
};