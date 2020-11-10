# a-cli

a-cli is a front-end engineering development tool for rapid development, build, and publish projects.

It can realize the decoupling of front-end projects and project engineering by 
integrating engineering-related codes into CLI plugin, and then executing them by global CLI commands.

Read this in other languages: English | [简体中文](./README_ZH-CN.md)

- [a-cli](#a-cli)
  - [Installation](#Installation)
  - [Command usage](#Command-usage)
    - [init command](#init)
    - [setting command](#setting)
    - [plugin command](#plugin)
      - [plugin new](#plugin-new)
      - [plugin link](#plugin-link)
      - [plugin unlink](#plugin-unlink)
      - [plugin publish](#plugin-publish)
      - [plugin list](#plugin-list)
    - [install command](#install)
    - [dev command](#dev)
    - [build command](#build)
    - [publish command](#publish)
      - [publish.options](#publishoptions)
      - [publish.config](#publishconfig)
    - [run command](#run)
  - [Develop CLI plugin](#Develop-CLI-plugin)
    - [Development Process](#Development-Process)
    - [Plugin calls the way](#Plugin-calls-the-way)
    - [CLI function and params](#CLI-function-and-params)


## Installation

```bash
npm install @a-cli/a-cli -g
```


## Command usage

### init

The init command is used to create a CLI configuration file in the project.
The execution of all other commands depends on the configuration file.

```bash
acli init
```

The configuration file (`a-cli-config.json`) support the options listed below:

```json
{
  "name": "cli-plugin-name",
  "publish": {
    "options": [],
    "config": null
  }
}
```

### setting

`a-cli` has a local configuration file, 
you can open the file manually (./local/setting.json) or quickly open the file through the setting command to modify it.

```bash
acli setting
```

setting.json:

```
{
  // Add custom templates to this array
  "templates": [
    {
      // template name
      "name": "a-cli-template",
      // template repository
      // To learn more about repo value, visit: https://www.npmjs.com/package/download-git-repo
      "repo": "a-cli/a-cli-template"
    }
  ]
}
```

The setting command also provides an option to display help content related to setting.json.

```bash
acli setting --help

acli setting -h
```

### plugin

The plugin command integrates related functions for scaffolding plug-in development,
including new, link, unlink, publish, list, etc.

```bash
acli plugin [command]
```

### plugin new

Create a new CLI plugin, 
you can download the CLI plugin template as a new plugin through the optional template option in the local settings(`local/setting.json`).

```bash
acli plugin new
```

### plugin link

Create a symlink in the a-cli folder plugins/<plugin> 
that links to the plugin where the plugin link command was executed.

```bash
acli plugin link
```

### plugin unlink

Remove a symlink in the a-cli folder plugins/<plugin> 
that links to the plugin where the plugin unlink command was executed.

```bash
acli plugin unlink
```

### plugin publish

Publishes a plugin to the npm registry so that it can be installed by name.

```bash
acli plugin publish
```

### plugin list

Get the list of local plugins in the plugins/ directory.

```bash
acli plugin list
```

### install

Install the CLI plugin that was published on "npm".

```bash
acli install
```

install as dependencies(npm i -S):

```bash
acli install --save

acli install -s
```

install as devDependencies(npm i -D):

```bash
acli install --dev

acli install -d
```

### dev

Development project. Its operation is based on the `dev.js` file in the CLI plugin and started by a dev server at runtime.

During runtime, npm install will be executed in the project.

```bash
acli dev
```

Provides a debug option that can skip npm install:

```bash
acli dev --debug

acli dev -d
```

### build

Building project code. Its operation is based on the `build.js` file in the CLI plugin.

During runtime, npm install will be executed in the project.

```bash
acli build
```

Provides a debug option that can skip npm install:

```bash
acli build --debug

acli build -d
```

### publish

Publish the project code.
Its operation is based on the `publish.js` file in the CLI plugin.

```bash
acli publish
```

Provides a debug option that can skip npm install:

```bash
acli publish --debug

acli publish -d
```

You can set publish-related properties(`publish`) in the configuration file(`a-cli-config.json`).

#### publish.options

Multiple publish-related parameters (such as system, environment, etc.) can be configured as options, 
which are available for selection when executing the publish command, 
and then the selected results are passed into the `publish.js` file as parameters.

```json
{
  "publish": {
    "options": [
      {
        "name": "Test",
        "value": "Valid json value(Default null)"
      },
      {
        "name": "Pre-release",
        "value": "Valid json value(Default null)"
      },
      {
        "name": "Production",
        "value": "Valid json value(Default null)"
      }
    ]
  }
}
```

Support multi-level nested option configuration:

```json
{
  "publish": {
    "options": [
      {
        "name": "foo-level-1",
        "options": [
          {
            "name": "foo-level-1-1",
            "options": [
              "you can set more options..."
            ]
          },
          {
            "name": "foo-level-1-2",
            "value": "Valid json value(Default null)"
          }
        ]
      },
      {
        "name": "bar-level-1",
        "options": [
          {
            "name": "bar-level-1-1",
            "value": "Valid json value(Default null)"
          },
          {
            "name": "bar-level-1-2",
            "value": "Valid json value(Default null)"
          }
        ]
      }
    ]
  }
}
```

If only one option is configured and there is no nested option or only one sub-nested option, 
there is no need to make a selection, 
and it will be automatically selected as the selected option.

#### publish.config

Any configuration that needs to be used when publishing can be set in the config attribute.

```json
{
  "publish": {
    "config": {
      "remote": "git@github.com:a-cli/a-cli.git"
    }
  }
}
```

### run

Run custom commands. Any executable JavaScript file in the CLI plugin directory can be run as a custom command, 
and its file name will be used as the name of the custom command.

```bash
acli run [script]
```

Provides a debug option, but it will not do special processing and will only pass it to the execution file of the custom command.


## Develop CLI plugin

### Development Process

1. Create a new CLI plugin through executing `acli plugin new`
2. Execute `acli plugin link` to link the plugin to the plugins/ directory by the symlink
3. Execute `acli init` in the target project to create a configuration file (a-cli-config.json), 
and set its `name` property to the corresponding CLI plug-in name
4. Development and debugging
5. After the development is completed, it can be published to npm through executing `acli plugin publish`
6. (Optional) Execute `acli plugin unlink` on the local CLI plugin path to remove the symlink in plugins/
7. (Optional) Execute `acli install` in the target project to install the CLI plugin that has been published on npm

### Plugin calls the way

The CLI plugin is called in the AOP mode. There are currently 2 ways to be called:

* the plugin that creates a symlink in the plugins/ folder by `acli plugin link`
* the plugin that installs in node_modules folder of the project

something important: If the above 2 ways exist for the same plugin, 
symlink-plugin has a higher priority than node_modules-plugin,
it is designed to facilitate the maintenance and upgrade of CLI plugins in the future.

### CLI function and params

CLI functions are all Common JS modules, exported as function, 
and receive two parameters `context` and `args` injected by `a-cli`.

```javascript
/**
* CLI function
* @param context {Object} context cbject
* @param args {Array} Command line params
* */
module.exports = function (context, args) {
  // useful utils
  const {
    // [Console print terminal with string styling](https://github.com/HaolinHom/std-terminal-logger)
    std,
    // [Parse process argv to object:](https://github.com/a-cli/wu-utils#parseArgs)
    parseArgs,
  } = context.utils;
  
  // useful packages
  const { 
    // [Terminal string styling](https://github.com/chalk/chalk)
    chalk,
    // [CLI prompts](https://github.com/enquirer/enquirer)
    enquirer,
  } = context.packages;
  
  // Only the dev command has this attribute!
  const {
    // Complete cli config object (a-cli-config.json) 
  } = context.config;
  
  // Only publish command has this attribute!
  const {
    // publish option object
    option: {
      // An array of all selected option names
      keys, 
      // The value of the last (level) option
      value,
    },
    // publish config
    config,
  } = context.publishOptions;

  // enjoy your code...
};
```