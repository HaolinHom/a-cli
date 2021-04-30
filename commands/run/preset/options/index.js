const { prompt } = require('enquirer');
const { typeOf } = require('hey-yoo-utils/common');

function getPresetOption(options, presetKeys) {
  let option = {
    keys: [],
    value: null,
  };

  if (!Array.isArray(options) || options.length === 0) {
    return option;
  }

  let tag;
  let i;
  for (i = 0; i < presetKeys.length; i++) {
    tag = options.find(opt => opt.name === presetKeys[i]);
    if (tag) {
      option.keys.push(tag.name);
      options = tag.options || [];
      if (options.length === 0) {
        option.value = tag.value || null;
      }
    } else {
      break;
    }
  }

  return option;
}

async function presetOptionPrompt({ options, message }, target) {
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

  let key;
  if (choices.length === 0) {
    return target;
  } else if (choices.length === 1) {
    key = choices[0];
  } else {
    const result = await prompt({
      name: 'key',
      type: 'select',
      message: message || 'Please choice preset option for project:',
      choices,
    });
    key = result.key;
  }
  target.keys.push(key);

  const tagOption = options.find(item => item.name === key || item === key);
  if (typeOf(tagOption) === 'object') {
    target.value = tagOption.value || target.value || null;
    return await presetOptionPrompt(tagOption, target);
  }

  return target;
}

async function resolvePresetOptions(scriptPreset, presetKeys) {
  let preset = {
    keys: [],
    value: null,
  };

  preset = Array.isArray(presetKeys) && presetKeys.length > 0 ?
    getPresetOption(scriptPreset.options, presetKeys)
    :
    await presetOptionPrompt(scriptPreset, preset);

  preset.define = scriptPreset.define || null;

  return preset;
}

module.exports = resolvePresetOptions;
