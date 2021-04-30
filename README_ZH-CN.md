# a-cli

a-cli是一个前端工程开发工具，用于快速开发、构建项目。

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
    - [run命令](#run)
      - [预设选项](#预设选项)
    - [dev命令](#dev)
    - [build命令](#build)
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

在项目内创建一个名称为`a-cli-config`的脚手架配置文件。默认为CommonJS，亦支持JSON格式。
其他所有命令的执行都依赖于该配置文件。

```bash
acli init
```

该配置文件默认有如下的这些属性:

```javascript
// a-cli-config.js
module.exports = {
  name: "cli-plugin-name",
  projectName: "project-name",
  preset: {}
};
```

### setting

`a-cli`会生成一个本地的配置文件(local/setting.js)，可以通过setting命令快速打开文件(如果不存在会自动创建)后进行修改。

```bash
acli setting
```

```javascript
// setting.js:
module.exports = {
  // 将自定义模板添加到此数组
  templates: [
    {
      // 模板名称
      name: "a-cli-template",
      // 模板库
      // 可访问 https://www.npmjs.com/package/download-git-repo 了解更多关于repo属性的信息
      repo: "a-cli/a-cli-template"
    }
  ]
};
```

### plugin

plugin命令集成了用于脚手架插件开发的相关功能，包括new、link、unlink、publish、list等。

```bash
acli plugin [command]
```

#### plugin new

新建一个脚手架插件，可以通过本地设置内的可选模板选项下载对应的插件模板作为新插件

```bash
acli plugin new
```

#### plugin link

创建一个从执行plugin link命令的文件夹链接到`a-cli`下的plugins/<plugin>文件夹的符号链接。

```bash
acli plugin link
```

#### plugin unlink

移除一个从执行plugin unlink命令的文件夹链接到`a-cli`下的plugins/<plugin>文件夹的符号链接。

```bash
acli plugin unlink
```

#### plugin publish

将插件发布到npm。

```bash
acli plugin publish
```

#### plugin list

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

### run

运行自定义命令。CLI插件目录中任何可执行的JavaScript文件都可作为自定义命令来运行，其文件名会作为自定义命令的名称。

```bash
acli run [script]
```

命令行参数：

| 选项 | 简写 | 描述 |
|----|----|----|
| --debug | -d | debug模式([dev](#dev)与[build](#build)命令在该模式下会自动安装依赖) |
| --preset [keys] | / | 预设选项的默认key值(当`preset[command].options`内有设置预设选项时，可以在命令行执行时跳过前置的人工选择) |

#### 预设选项

run命令可以在配置文件(`a-cli-config.js`)中设置相关的预设选项(preset)并在运行时作为选项供选择。

所有通过run运行的命令(包括[dev](#dev)与[build](#build))都可以通过配置预设选项来使用。

```javascript
// a-cli-config.js
module.exports = {
  preset: {
    // 可执行的命令文件名作为key值
    dev: {
      steps: [],
      define: null
    }
  }
};
```

* preset.steps {array}

每个步骤都采用一个配置对象，该对象实现以下接口：

| 属性 | 必需 | Type | Description |
| ---- | ---- | ---- | ---- |
| type | 是 | string | step类型，包括 "input"、"select"、"multiselect"、"toggle"、"numeral"与"password"。 |
| message | 是 | string | 显示在终端中的消息 |
| initial | 否 | string | 默认值 |

可以组合多种`steps`，它将按顺序执行。例如：

```javascript
// a-cli-config.js
module.exports = {
  preset: {
    dev: {
      steps: [
        {
          type: 'input',
          message: 'Please type something:'
        },
        {
          type: 'select',
          message: 'Please choose dev env:',
          choices: [
            'test',
            'pre',
            'prd',
          ],
        },
        {
          type: 'multiselect',
          message: 'Please choose some:',
          choices: [
            'moduleA',
            'moduleB',
            'moduleC',
            'moduleD',
          ],
        },
        {
          type: 'toggle',
          message: 'Do you want to use proxy:',
          enabled: 'Yes',
          disabled: 'No',
        },
        {
          type: 'numeral',
          message: 'Please enter a number:',
        },
        {
          type: 'password',
          message: 'Please enter your password:',
        },
      ],
      define: null
    }
  }
};
```

* preset.define {object}

可以在define属性中设置需要用到的任何定义。

```javascript
// a-cli-config.js
module.exports = {
  preset: {
    dev: {
      options: [],
      define: {
        remote: "git@github.com:a-cli/a-cli.git"
      }    
    }
  }
};
```

* preset.options(待弃用)

推荐使用`steps`代替`options`，未来将不对其提供支持。

### dev

> 该命令是对[run](#run)命令的封装，其用法均与[run](#run)一致。

开发项目。其运行是基于CLI插件中的`dev.js`文件，并在运行时由devServer启动。

```bash
acli dev
```

### build

> 该命令是对[run](#run)命令的封装，其用法均与[run](#run)一致。

构建项目代码。其运行是基于CLI插件中的`build.js`文件。

```bash
acli build
```


## 开发CLI插件

### 开发流程

1. 通过`acli plugin new`创建一个新的CLI插件
2. 执行`acli plugin link`将该插件链接到 plugins/ 目录下
3. 在目标项目内执行`acli init`来创建配置文件(a-cli-config.js)，并将其`name`属性设为对应的CLI插件名称
4. 开发及调试
5. (可选)开发完成后可通过`acli plugin publish`将其发布到npm上
6. (可选)在本地CLI插件路径上执行`acli plugin unlink`将 plugins/ 内的链接移除
7. (可选)在目标项目内执行`acli install`将已经发布到npm上的CLI插件安装为项目开发依赖

### 调用方式

CLI插件目前有2种被调用的方式：

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
  
  // 完整的cli配置(a-cli-config.js)对象
  const {
    ...something
  } = context.config;
  
  // 有配置`预设`的命令可用
  const {
    // 预设步骤返回值
    steps: [],
    // 预设定义返回值
    define: {},
  } = context.preset;

  // enjoy your code...
};
```