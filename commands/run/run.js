const std = require('std-terminal-logger');
const resolvePresetSteps = require('./preset/steps');
const resolvePresetOptions = require('./preset/options');
const typeOf = require('../../utils/typeOf');
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
  console.log(JSON.stringify(preset, null, 2));

  return { preset };
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
    	const presetKeys = options.preset.length > 0 ? options.preset.split(',') : [];
      const ctxExtend = await getPreset(scriptPreset, presetKeys);
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