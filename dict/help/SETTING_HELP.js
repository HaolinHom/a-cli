const chalk = require('chalk');

module.exports = chalk.whiteBright(
`
{
  ${chalk.gray('// Add custom templates to this array')}
  "templates": [
    {
      ${chalk.gray('// template name')}
      "name": "a-cli-template",
      ${chalk.gray('// template repository')}
      ${chalk.gray(`// To learn more about repo value, visit: ${chalk.blueBright('https://www.npmjs.com/package/download-git-repo')}`)}
      "repo": "HaolinHom/a-cli-template"
    },
  ]
}`
);