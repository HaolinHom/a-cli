const { chalk } = require('wu-utils');

module.exports = chalk.whiteBright(
`
{
  ${chalk.gray('// Add custom templates to this array')}
  "templates": [
    {
      ${chalk.gray('// template name')}
      "name": "wu-cli-template",
      ${chalk.gray('// template repository')}
      ${chalk.gray(`// To learn more about repo value, visit: ${chalk.blueBright('https://www.npmjs.com/package/download-git-repo')}`)}
      "repo": "wu-node/wu-cli-template"
    },
  ]
}`
);