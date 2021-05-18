const { default: ow } = require('ow');
const std = require('std-terminal-logger');

function validate(value, label, predicate) {
  if (!value) {
    return false;
  }
  let result = true;
  try {
    ow(...[value, label, predicate].filter(Boolean));
  } catch (error) {
    std.error(error);
    result = false;
  }
  return result;
}

module.exports.validateConfig = function (config, label) {
  return validate(
    config,
    label,
    ow.object.partialShape({
      name: ow.string.not.empty,
      preset: ow.optional.object,
    })
  );
};

module.exports.validateHeyConfig = function (config, label) {
  return validate(
    config,
    label,
    ow.object.partialShape({
      name: ow.string.not.empty,
      version: ow.string.not.empty,
      register: ow.optional.array.exactShape([
        ow.optional.object.exactShape({
          command: ow.string.not.empty,
          options: ow.optional.array.ofType(ow.string),
          action: ow.function,
          description: ow.optional.string,
        }),
      ]),
    })
  );
};