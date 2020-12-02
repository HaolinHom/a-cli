# a-cli

a-cli是一个前端工程开发工具，用于快速开发、构建、发布项目。

其通过将工程化相关的代码整合为CLI插件，再由全局的CLI命令进行执行，可实现前端项目与项目工程化的解耦。

使用其他语言阅读：[English](./README.md) | 简体中文

- [a-cli](#a-cli)
  - [安装](#安装)
  - [命令的使用](#命令的使用)
    - [init命令](#init)
    - [setting命令](#setting)
    - [plugin命令](#plugin)
      - [plugin new](#plugin-new)
      - [plugin link](#plugin-link)
      - [plugin unlink](#plugin-unlink)
      - [plugin publish](#plugin-publish)
      - [plugin list](#plugin-list)
    - [install命令](#install)
    - [dev命令](#dev)
    - [build命令](#build)
    - [publish命令](#publish)
    - [run命令](#run)
      - [预设选项](#预设选项)
  - [开发CLI插件](#开发CLI插件)
    - [开发流程](#开发流程)
    - [调用方式](#调用方式)
    - [CLI函数及参数](#CLI函数及参数)


## 安装

```bash
npm install a-cli-core -g
```


## 命令的使用

### init

在项目内创建一个脚手架配置文件。除此之外的所有命令的执行都依赖于该配置文件。

```bash
acli init
```

该配置文件(`a-cli-config.json`)支持如下的这些选项:

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

`a-cli`有一个本地的配置文件，可以手动打开该文件(./local/setting.json)或
通过setting命令快速打开文件后进行修改。

```bash
acli setting
```

setting.json:

```
{
  // 将自定义模板添加到此数组
  "templates": [
    {
      // 模板名称
      "name": "a-cli-template",
      // 模板库
      // 可访问 https://www.npmjs.com/package/download-git-repo 了解更多关于repo属性的信息
      "repo": "a-cli/a-cli-template"
    }
  ]
}
```

setting命令还提供了一个用于显示与setting.json有关的帮助内容的选项。

```bash
acli setting --help

acli setting -h
```

### plugin

plugin命令集成了用于脚手架插件开发的相关功能，包括new、link、unlink、publish、list等。

```bash
acli plugin [command]
```

### plugin new

新建一个脚手架插件，可以通过本地设置内的可选模板选项下载对应的插件模板作为新插件

```bash
acli plugin new
```

### plugin link

创建一个从执行plugin link命令的文件夹链接到`a-cli`下的plugins/<plugin>文件夹的符号链接。

```bash
acli plugin link
```

### plugin unlink

移除一个从执行plugin unlink命令的文件夹链接到`a-cli`下的plugins/<plugin>文件夹的符号链接。

```bash
acli plugin unlink
```

### plugin publish

将插件发布到npm。

```bash
acli plugin publish
```

### plugin list

获取 plugins/ 目录下的本地插件列表。

```bash
acli plugin list
```

### install

安装已经发布到npm的脚手架插件。

```bash
acli install
```

脚手架插件作为项目依赖进行安装(npm i -S):

```bash
acli install --save

acli install -s
```

脚手架插件作为项目开发依赖进行安装(npm i -D):

```bash
acli install --dev

acli install -d
```

### dev

> 该命令是对[run](#run)命令的调用，并可在配置文件(`a-cli-config.json`)中设置相关[预设选项](#预设选项)(preset)并在运行时作为选项供选择。

开发项目。其运行是基于CLI插件中的`dev.js`文件，并在运行时由devServer启动。

运行时会在项目内执行npm install，在debug模式时不执行。

```bash
acli dev

acli dev --debug

acli dev -d
```

### build

> 该命令是对[run](#run)命令的调用，并可在配置文件(`a-cli-config.json`)中设置相关[预设选项](#预设选项)(preset)并在运行时作为选项供选择。

构建项目代码。其运行是基于CLI插件中的`build.js`文件。

运行时会在项目内执行npm install，在debug模式时不执行。

```bash
acli build

acli build --debug

acli build -d
```

### publish

> 该命令是对[run](#run)命令的调用，并可在配置文件(`a-cli-config.json`)中设置相关[预设选项](#预设选项)(preset)并在运行时作为选项供选择。

发布项目代码。其运行是基于CLI插件中的`publish.js`文件。

运行时会在项目内执行npm install，在debug模式时不执行。

```bash
acli publish

acli publish --debug

acli publish -d
```

### run

运行自定义命令。CLI插件目录中任何可执行的JavaScript文件都可作为自定义命令来运行，其文件名会作为自定义命令的名称。

```bash
acli run [script]
```

run命令提供了一个debug选项，但不会做特殊处理，只会将其传递到自定义命令的执行文件内。

#### 预设选项

run命令可以在配置文件(`a-cli-config.json`)中设置相关的预设选项(preset)并在运行时作为选项供选择。

所有通过run运行的命令(包括[dev](#dev), [build](#build), [publish](#publish))都可以通过配置预设选项来使用。

```json
// a-cli-config.json
{
  "preset": {
    // 可执行的命令文件名作为key值
    "publish": {
      "options": [],
      "define": null
    }
  }
}
```

* preset.options

可以将多个参数（例如系统，环境等）设置为选项，这些参数在执行命令时可供选择，之后将所选结果作为参数传递到目标文件中。

```json
// a-cli-config.json
{
  "preset": {
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
}
```

支持多级嵌套选项配置:

```json
// a-cli-config.json
{
  "preset": {
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
}
```

如果仅配置了一个选项，并且没有嵌套选项或只有一个子嵌套选项，则无需进行选择，它将被自动选择为所选选项。

* preset.define

可以在define属性中设置需要用到的任何定义。

```json
// a-cli-config.json
{
  "preset": {
    "publish": {
      "define": {
        "remote": "git@github.com:a-cli/a-cli.git"
      }    
    }
  }
}
```


## 开发CLI插件

### 开发流程

1. 通过`acli plugin new`创建一个新的CLI插件
2. 执行`acli plugin link`将该插件链接到 plugins/ 目录下
3. 在目标项目内执行`acli init`来创建配置文件(a-cli-config.json)，并将其`name`属性设为对应的CLI插件名称
4. 开发及调试
5. 开发完成后可通过`acli plugin publish`将其发布到npm上
6. (可选)在本地CLI插件路径上执行`acli plugin unlink`将 plugins/ 内的链接移除
7. (可选)在目标项目内执行`acli install`将已经发布到npm上的CLI插件安装为项目开发依赖

### 调用方式

CLI插件是以AOP模式进行调用的，目前有2种被调用的方式：

* 通过`acli plugin link`命令将本地插件以symlink的方式链接到plugins/目录下的插件
* 安装在项目内的 node_modules 目录下的插件 

这里有个需要注意的地方：同一个插件如果同时存在以上2种方式时，链接后的本地插件优先级高于安装在node_modules内的，
这是为了方便日后对CLI插件进行维护及升级而设计的。

### CLI函数及参数

CLI函数都是CommonJS模块，导出为函数，接收由`a-cli`对其注入的两个参数`context`和`args`。

```javascript
/**
* CLI函数
* @param context {Object} context对象
* @param args {Array} 命令行参数
* */
module.exports = function (context, args) {
  // 实用工具
  const {
    // [Console print terminal with string styling](https://github.com/HaolinHom/std-terminal-logger)
    std,
    // [Parse process argv to object:](https://github.com/a-cli/a-cli-utils#parseArgs)
    parseArgs,
  } = context.utils;
  
  // 实用包
  const { 
    // [Terminal string styling](https://github.com/chalk/chalk)
    chalk,
    // [CLI prompts](https://github.com/enquirer/enquirer)
    enquirer,
  } = context.packages;
  
  // 仅dev命令有该属性！
  const {
    // 完整的cli配置(a-cli-config.json)对象
  } = context.config;
  
  // 仅publish命令有该属性！
  const {
    // 发布选项
    option: {
      // 所有选定的选项名称组成的数组
      keys, 
      // 最后一个(层级)选项的值
      value,
    },
    // 发布配置
    config,
  } = context.publishOptions;

  // enjoy your code...
};
```