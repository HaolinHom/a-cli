const { prompt } = require('enquirer');
const {
  matchStepKey,
  stepAdapter,
} = require('./utils');
const {
  ALLOW_TYPES,
} = require('./config');

async function stepsPrompt(steps, prev, accumulate = []) {
  let step = steps.shift();
  if (step) {
    step = stepAdapter(step, prev, accumulate);
    if (!step.name) {
      step.name = 'STEP_NAME';
    }
    const result = await prompt(step);
    const value = result[step.name];
    prev = value;
    accumulate.push(value);
    if (steps.length > 0) {
      return await stepsPrompt(steps, prev, accumulate);
    }
  }
  return accumulate;
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
        step.type = step.type.toLowerCase();
        if (ALLOW_TYPES.includes(step.type)) {
          presetSteps.push(matchStepKey(step, key));
        }
      }
    });
  }

  if (steps.length > 0) {
    const promptResult = await stepsPrompt(steps);
    presetSteps = presetSteps.concat(promptResult);
  }

  return presetSteps;
}

module.exports = resolvePresetSteps;