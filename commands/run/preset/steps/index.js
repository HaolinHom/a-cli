const { prompt } = require('enquirer');
const { common: { typeOf } } = require('hey-yoo-utils');
const {
  TYPE_INPUT,
  TYPE_SELECT,
  TYPE_CONFIRM,
  TYPE_TOGGLE,
  TYPE_NUMBER,
  TYPE_PASSWORD,
  ALLOW_TYPES,
} = require('./config');

function matchStepKey(step, key) {
  switch (step.type) {
    case TYPE_INPUT:
    case TYPE_PASSWORD:
      return key;
    case TYPE_SELECT:
      return step.choices.find((item) => {
        const type = typeOf(item);
        return (type === 'string' && item === key) || (type === 'object' && item.name === key);
      });
    case TYPE_CONFIRM:
    case TYPE_TOGGLE:
      return key === 'true';
    case TYPE_NUMBER:
      return Number(key);
    default:
      return undefined;
  }
}

async function resolvePresetSteps(steps, presetKeys) {
  let presetSteps = [];

  if (steps.length === 0) {
    return presetSteps;
  }

  if (presetKeys.length > 0) {
    presetKeys.forEach((key) => {
      let step = steps.shift();
      if (step && typeof step.type === 'string') {
        step.type.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
          return $1.toUpperCase() + $2.toLowerCase();
        });
        if (ALLOW_TYPES.includes(step.type)) {
          presetSteps.push(matchStepKey(step, key));
        }
      }
    });
  }

  if (steps.length > 0) {
    steps.forEach((item, index) => {
      item.name = `step_${index}`;
    });
    const result = await prompt(steps);
    presetSteps = presetSteps.concat(Object.values(result));
  }

  return presetSteps;
}

module.exports = resolvePresetSteps;