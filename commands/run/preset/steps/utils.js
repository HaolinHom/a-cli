const {
  runFunc,
  typeOf,
} = require('hey-yoo-utils/common');
const {
  TYPE_INPUT,
  TYPE_SELECT,
  TYPE_TOGGLE,
  TYPE_NUMBER,
  TYPE_PASSWORD,
  ALLOW_TYPES,
} = require('./config');

function getDefaultMessage(stepType) {
  switch (stepType) {
    case TYPE_INPUT:
      return 'Please enter content:';
    case TYPE_SELECT:
      return 'Please choose one:';
    case TYPE_TOGGLE:
      return 'Please choose one:';
    case TYPE_NUMBER:
      return 'Please enter a number:';
    case TYPE_PASSWORD:
      return 'Please enter password';
    default:
      return '';
  }
}

function typeAdapter(stepType) {
  switch (stepType) {
    case TYPE_NUMBER:
      return 'numeral';
    default:
      return stepType;
  }
}

module.exports.stepAdapter = function (step, prev, accumulate) {
  if (typeof step.type !== 'string') {
    step = runFunc(step, prev, accumulate);
    if (step) {
      return step;
    }
    throw new Error(`Preset step.type is undefined.`);
  }

  step.type = step.type.toLowerCase();

  if (ALLOW_TYPES.indexOf(step.type) === -1) {
    throw new Error(`Preset step.type (${step.type}) is invalid.`);
  }

  step.skip = runFunc(step.skip, prev, accumulate);
  if (step.skip) {
    return step;
  }

  step.message = step.message || getDefaultMessage(step.type);

  step.type = typeAdapter(step.type);

  return step;
};

module.exports.matchStepKey = function (step, key) {
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
};
