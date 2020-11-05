# wu-cli

wu-cli is a Front-end engineering development tools.

- [wu-cli](#wu-cli)
  - [Installation](#Installation)
  - [Command usage](#Command-usage)
    - [init command](#init)
    - [setting command](#setting)
    - [plugin command](#plugin)
      - [plugin new](#plugin-new)
      - [plugin link](#plugin-link)
      - [plugin unlink](#plugin-unlink)
      - [plugin publish](#plugin-publish)
    - [install command](#install)
    - [dev command](#dev)
    - [build command](#build)
    - [publish command](#publish)
      - [publish.options](#publishoptions)
      - [publish.config](#publishconfig)
    - [run command](#run)

## Installation

```bash
npm install wu-cli -g
```

## Command usage

### init

The init command is used to create a cli configuration file in the project.
The execution of all other commands depends on the configuration file.

```bash
wucli init
```

The configuration file (`wu-cli-config.json`) support the options listed below:

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

`wu-cli` has a local configuration file, 
you can open the file manually (./local/setting.json) or quickly open the file through the setting command to modify it.

```bash
wucli setting
```

setting.json:

```json
{
  "templates": [
    {
      "name": "wu-cli-template",
      "repo": "wu-cli/wu-cli-template"
    }
  ]
}
```

The setting command also provides an option to display help content related to setting.json.

```bash
wucli setting --help

wucli setting -h
```

### plugin

The plugin command integrates related functions for scaffolding plug-in development,
including new, link, unlink, publish, etc.

```bash
wucli plugin [command]
```

### plugin new

Create a new CLI plugin, 
you can download the CLI plugin template as a new plugin through the optional template option in the local settings(`local/setting.json`).

```bash
wucli plugin new
```

### plugin link

Create a symlink in the wu-cli folder plugins/<plugin> 
that links to the plugin where the plugin link command was executed.

```bash
wucli plugin link
```

### plugin unlink

Remove a symlink in the wu-cli folder plugins/<plugin> 
that links to the plugin where the plugin unlink command was executed.

```bash
wucli plugin unlink
```

### plugin publish

Publishes a plugin to the npm registry so that it can be installed by name.

```bash
wucli plugin publish
```

### install

Install the CLI plugin that published on "npm".

```bash
wucli install
```

install as dependencies(npm i -S):

```bash
wucli install --save

wucli install -s
```

install as devDependencies(npm i -D):

```bash
wucli install --dev

wucli install -d
```

### dev

Development project. Its operation is based on the `dev.js` file in the cli plugin, and started by a devServer at runtime.

During runtime, npm install will be executed in the project.

```bash
wucli dev
```

Provides a debug option that can skip npm install:

```bash
wucli dev --debug

wucli dev -d
```

### build

Building project code. Its operation is based on the `build.js` file in the cli plugin.

During runtime, npm install will be executed in the project.

```bash
wucli build
```

Provides a debug option that can skip npm install:

```bash
wucli build --debug

wucli build -d
```

### publish

Publish project code.
Its operation is based on the `publish.js` file in the cli plugin.

```bash
wucli publish
```

Provides a debug option that can skip npm install:

```bash
wucli publish --debug

wucli publish -d
```

You can set publish-related properties(`publish`) in the configuration file(`wu-cli-config.json`).

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
  	  "remote": "git@github.com:wu-cli/wu-cli.git"
  	}
  }
}
```

### run

Run custom commands. Any executable JavaScript file in the CLI plugin directory can be run as a custom command, 
and its file name will be used as the name of the custom command.

```bash
wucli run [script]
```

Provides a debug option, but it will not do special processing and will only pass it to the execution file of the custom command.