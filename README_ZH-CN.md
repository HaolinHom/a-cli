# wu-cli

wu-cli是一个前端工程开发工具。

- [wu-cli](#wu-cli)
  - [安装](#安装)
  - [命令的使用](#命令的使用)
    - [init命令](#init)
    - [setting命令](#setting)
    - [plugin命令](#plugin)
      - [plugin new](#plugin-new)
      - [plugin link](#plugin-link)
      - [plugin unlink](#plugin-unlink)
      - [plugin publish](#plugin-publish)
    - [install命令](#install)
    - [dev命令](#dev)
    - [build命令](#build)
    - [publish命令](#publish)
      - [publish.options](#publishoptions)
      - [publish.config](#publishconfig)
    - [run命令](#run)

## 安装

```bash
npm install wu-cli -g
```

## 命令的使用

### init

在项目内创建一个脚手架配置文件。除此之外的所有命令的执行都依赖于该配置文件。

```bash
wucli init
```

该配置文件(`wu-cli-config.json`)支持如下的这些选项:

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

`wu-cli`有一个本地的配置文件，可以手动打开该文件(./local/setting.json)或
通过setting命令快速打开文件后进行修改。

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

setting命令还提供了一个用于显示与setting.json有关的帮助内容的选项。

```bash
wucli setting --help

wucli setting -h
```

### plugin

plugin命令集成了用于脚手架插件开发的相关功能，包括new、link、unlink、publish等。

```bash
wucli plugin [command]
```

### plugin new

新建一个脚手架插件，可以通过本地设置内的可选模板选项下载对应的插件模板作为新插件

```bash
wucli plugin new
```

### plugin link

创建一个从执行plugin link命令的文件夹链接到`wu-cli`下的plugins/<plugin>文件夹的符号链接。

```bash
wucli plugin link
```

### plugin unlink

移除一个从执行plugin unlink命令的文件夹链接到`wu-cli`下的plugins/<plugin>文件夹的符号链接。

```bash
wucli plugin unlink
```

### plugin publish

将插件发布到npm。

```bash
wucli plugin publish
```

### install

安装已经发布到npm的脚手架插件。

```bash
wucli install
```

脚手架插件作为项目依赖进行安装(npm i -S):

```bash
wucli install --save

wucli install -s
```

脚手架插件作为项目开发依赖进行安装(npm i -D):

```bash
wucli install --dev

wucli install -d
```

### dev

开发项目。其运行是基于CLI插件中的`dev.js`文件，并在运行时由devServer启动。

运行时会在项目内执行npm install。

```bash
wucli dev
```

提供了一个debug选项，可以在跳过npm install:

```bash
wucli dev --debug

wucli dev -d
```

### build

构建项目代码。其运行是基于CLI插件中的`build.js`文件。

提供了一个debug选项，可以在跳过npm install:

```bash
wucli build
```

build命令提供了一个debug选项，可以在跳过npm install。

```bash
wucli build --debug

wucli build -d
```

### publish

发布项目代码。其运行是基于CLI插件中的`publish.js`文件。

运行时会在项目内执行npm install。

```bash
wucli publish
```

提供了一个debug选项，可以在跳过npm install:

```bash
wucli publish --debug

wucli publish -d
```

可以在配置文件(`wu-cli-config.json`)中设置与发布相关的属性(`publish`).

#### publish.options

可以将多个与发布相关的参数（例如系统，环境等）设置为选项，这些参数在执行publish命令时可供选择，之后将所选结果作为参数传递到`publish.js`文件中。

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

支持多级嵌套选项配置:

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

如果仅配置了一个选项，并且没有嵌套选项或只有一个子嵌套选项，则无需进行选择，它将被自动选择为所选选项。

#### publish.config

可以在config属性中设置发布时需要使用的任何配置。

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

运行自定义命令。CLI插件目录中任何可执行的JavaScript文件都可作为自定义命令来运行，其文件名会作为自定义命令的名称。

```bash
wucli run [script]
```

run命令提供了一个debug选项，但不会做特殊处理，只会将其传递到自定义命令的执行文件内。