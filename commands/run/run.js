const std = require('std-terminal-logger');
const resolvePresetSteps = require('./preset/steps');
const resolvePresetOptions = require('./preset/options');
const { typeOf } = require('hey-yoo-utils/common');
const getContext = require('../../utils/getContext');
const packageInstall = require('../../utils/packageInstall');

async function getPreset(scriptPreset, presetKeys) {
  let preset = {
    steps: [],
    define: scriptPreset.define || null,
  };

  if (scriptPreset.hasOwnProperty('steps') && Array.isArray(scriptPreset.steps)) {
    preset.steps = await resolvePresetSteps(scriptPreset.steps, presetKeys);
  } else {
    // TODO: will remove in next feature
    preset.option = await resolvePresetOptions(scriptPreset, presetKeys);
  }

  return { preset };
}

function presetAdepter(preset) {
  if (typeof preset !== 'string' || preset.length === 0) {
    return [];
  }

  const arrayMatch = preset.match(/\[.*?]/);
  const isMatch = Array.isArray(arrayMatch) && arrayMatch[0];
  if (isMatch) {
    preset = preset.replace(arrayMatch[0], '_MATCH_PLACEHOLDER_');
  }

  let presetKeys = preset.split(',');
  if (isMatch) {
    presetKeys[presetKeys.indexOf('_MATCH_PLACEHOLDER_')] = arrayMatch[0].replace('[', '').replace(']', '').split(',');
  }

  return presetKeys;
}

const defaultOpts = {
  installDeps: false,
	script: null,
};

module.exports = async function (tagJsPath, cfgPath, args, options = defaultOpts) {
  const tagJs = require(tagJsPath);
  if (typeof tagJs === 'function') {

    const config = require(cfgPath);
    let ctx = { config };

    if (options.installDeps) {
      packageInstall();
    }

    if (options.script && config.preset && config.preset[options.script]) {
    	const scriptPreset = config.preset[options.script];
      const ctxExtend = await getPreset(scriptPreset, presetAdepter(options.preset));
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