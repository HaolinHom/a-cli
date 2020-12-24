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
    - [run command](#run)
      - [preset](#preset)
    - [dev command](#dev)
    - [build command](#build)
    - [publish command](#publish)
  - [Develop CLI plugin](#Develop-CLI-plugin)
    - [Development Process](#Development-Process)
    - [Plugin calls the way](#Plugin-calls-the-way)
    - [CLI function and params](#CLI-function-and-params)


## Installation

```bash
npm install a-cli-core -g
```


## Command usage

### init

Create a CLI configuration file named `a-cli-config` in the project. 
The default is CommonJS format, which also supports JSON format.
The execution of all other commands depends on the configuration file.

```bash
acli init
```

The configuration file has the following attributes by default:

```javascript
// a-cli-config.js
module.exports = {
  name: "cli-plugin-name",
  projectName: "project-name",
  preset: {}
};
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

#### plugin new

Create a new CLI plugin, 
you can download the CLI plugin template as a new plugin through the optional template option in the local settings(`local/setting.json`).

```bash
acli plugin new
```

#### plugin link

Create a symlink in the a-cli folder plugins/<plugin> 
that links to the plugin where the plugin link command was executed.

```bash
acli plugin link
```

#### plugin unlink

Remove a symlink in the a-cli folder plugins/<plugin> 
that links to the plugin where the plugin unlink command was executed.

```bash
acli plugin unlink
```

#### plugin publish

Publishes a plugin to the npm registry so that it can be installed by name.

```bash
acli plugin publish
```

#### plugin list

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

### run

Run custom commands. Any executable JavaScript file in the CLI plugin directory can be run as a custom command, 
and its file name will be used as the name of the custom command.

```bash
acli run [script]
```

Command line flags:

| options | short | description |
|----|----|----|
| --debug | -d | debug mode([dev](#dev), [build](#build) and [publish](#publish) commands in this mode, dependencies are automatically installed) |
| --preset [keys] | / | The default key value of the preset option(When `preset[command].options` has preset options, it can skip the pre-manual selection on the command line) |

#### preset

The `run command` can set related preset options in the configuration file (`a-cli-config.js`) 
and provide options for choose during runtime.

All commands(include [dev](#dev), [build](#build), [publish](#publish)) run through `run command` can be used 
by configuring preset options.

```javascript
// a-cli-config.js
module.exports = {
  preset: {
    // The executable command's file name is used as the key value
    publish: {
      options: [],
      define: null
    }
  }
};
```

* preset.options

Multiple parameters (such as system, environment, etc.) can be configured as options, 
which are available for selection when executing the run command, 
and then the selected results are passed into the target file as parameters.

```javascript
// a-cli-config.js
module.exports = {
  preset: {
    publish: {
      options: [
        {
          name: "Test",
          value: "Valid value(Default null)"
        },
        {
          name: "Pre-release",
          value: "Valid value(Default null)"
        },
        {
          name: "Production",
          value: "Valid value(Default null)"
        }
      ],
      define: null   
    }
  }
};
```

Support multi-level nested option configuration:

```javascript
// a-cli-config.js
module.exports = {
  preset: {
    publish: {
      options: [
        {
          name: "foo-level-1",
          options: [
            {
              name: "foo-level-1-1",
              options: [
                "you can set more options..."
              ]
            },
            {
              name: "foo-level-1-2",
              value: "Valid value(Default null)"
            }
          ]
        },
        {
          name: "bar-level-1",
          value: "Valid value(Default null)"
        }
      ],
      define: null
    }
  }
};
```

If only one option is configured and there is no nested option or only one sub-nested option, 
there is no need to make a selection, 
and it will be automatically selected as the selected option.

* preset.define

Any configuration that needs to be used can be set in the define attribute.

```javascript
// a-cli-config.js
module.exports = {
  preset: {
    publish: {
      options: [],
      define: {
        remote: "git@github.com:a-cli/a-cli.git"
      }    
    }
  }
};
```

### dev

> This command is an encapsulation of the [run](#run) command, 
and its usage is consistent with the [run](#run) command.

Development project. Its operation is based on the `dev.js` file in the CLI plugin and started by a dev server at runtime.

```bash
acli dev
```

### build

> This command is an encapsulation of the [run](#run) command,
and its usage is consistent with the [run](#run) command.

Building project code. Its operation is based on the `build.js` file in the CLI plugin.

```bash
acli build
```

### publish

> This command is an encapsulation of the [run](#run) command,
and its usage is consistent with the [run](#run) command.

Publish the project code. Its operation is based on the `publish.js` file in the CLI plugin.

```bash
acli publish
```

## Develop CLI plugin

### Development Process

1. Create a new CLI plugin through executing `acli plugin new`
2. Execute `acli plugin link` to link the plugin to the plugins/ directory by the symlink
3. Execute `acli init` in the target project to create a configuration file (a-cli-config.js), 
and set its `name` property to the corresponding CLI plug-in name
4. Development and debugging
5. (Optional) After the development is completed, it can be published to npm through executing `acli plugin publish`
6. (Optional) Execute `acli plugin unlink` on the local CLI plugin path to remove the symlink in plugins/
7. (Optional) Execute `acli install` in the target project to install the CLI plugin that has been published on npm

### Plugin calls the way

The CLI plugin currently has 2 ways to be called:

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
* @param context {Object} context object
* @param args {Array} Command line params
* */
module.exports = function (context, args) {
  // useful utils
  const {
    // [Console print terminal with string styling](https://github.com/HaolinHom/std-terminal-logger)
    std,
    // [Parse process argv to object:](https://github.com/a-cli/a-cli-utils#parseArgs)
    parseArgs,
  } = context.utils;
  
  // useful packages
  const { 
    // [Terminal string styling](https://github.com/chalk/chalk)
    chalk,
    // [CLI prompts](https://github.com/enquirer/enquirer)
    enquirer,
  } = context.packages;
  
  // Complete cli config object (a-cli-config.js) 
  const {
    ...something
  } = context.config;
  
  // Commands for configuring `preset options` are available
  const {
    option: {
      // An array of all selected option names
      keys, 
      // The value of the last (level) option
      value,
    },
    define,
  } = context.preset;

  // enjoy your code...
};
```