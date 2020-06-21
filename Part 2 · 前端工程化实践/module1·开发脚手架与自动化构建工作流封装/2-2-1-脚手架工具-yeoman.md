# 脚手架工具概要

脚手架的本质作用就是创建项目基础结构、提供项目规范和约定的工具。

- 相同的组织结构
- 相同的开发范式
- 相同的模块依赖
- 相同的工具配置
- 相同的基础代码

## 内容概要

- 脚手架的作用
- 常用脚手架工具
- 通用脚手架工具剖析
- 开发一款脚手架

## 常用的脚手架工具

- vue-cli
- create-react-app
- angular-cli
- yeoman
- plop

## Yeoman

### 基本使用

- **检查环境**

```
node -v
npm -v
yarn -v
```

- **全局安装**

```
yarn global add yo
```

- **安装Generator**

```
yarn global add generator-node
```

```
mkdir my-module
cd my-module\
yo node
```

## Sub Generator

```
yo node:cli
```

```
yarn link
yarn 
my-module --help
```

## 使用步骤总结

1. 明确你的需求
2. 找到合适的Generator
3. 全局范围安装找到的Genetator
4. 通过Yo运行对应的Generator
5. 通过命令行交互填写选项
6. 生成你所需要的项目结构

## 安装一个webapp

```
yarn global add generator-webapp
yo webapp
```

## 自定义Generator

基于Yeoman搭建自己的脚手架（创建generator其实就是创建一个npm模块）

## Generator 基本结构

```text
├── Generators/ ·························· 生成器目录
│   └── app ······························ 默认生成器目录
│       └── index.js ····················· 默认生成器实现
└── package.json ························· 模块包配置文件
```

```text
├── Generators/ ·························· 生成器目录
│   └── app ······························ 默认生成器目录
│   │   └── index.js ····················· 默认生成器实现
│   └── component/ ······················· 其他生成器目录
│       └── index.js ····················· 其它生成器实现
└── package.json ························· 模块包配置文件
```

*yoman 的生成器必须是 generator-<name> 的形式*

### 步骤：

```
mkdir generator-xiaodong
cd generator-xiaodong
yarn init --yes
yarn add yoeman-generator
```

按照上面的目录结构创建目录，在index.js里面写入

```js
// 此文件作为Generator的入口
// 需要导出一个继承自Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require("yeoman-generator")

module.exports = class extends Generator {
    writing () {
        // Yeoman 自动生成文件的阶段调用此方法
        // 我们可以通过文件读写的方式往目录中写文件
        this.fs.write(
            this.destinationPath('temp.txt'),
            '这是文件内容'
        )
    }
}
```

```
yarn link
```

至此一个简单的generator就创建好了，可以通过yo xiaodong使用

### 使用示例：

```
mkdir my-pro
cd my-pro
yo xiaodong
```

## 文件模板

在使用一个generator创建一个项目的时候往往创建很多的文件，使用上面的方法就会显得很麻烦，所以可以使用文件模板的方式创建。

```js
writing () {
    // 模板文件路径
    const tmpl = this.templatePath("foo.txt")
    // 输出文件路径
    const output = this.destinationPath("foo.txt")
    // 模板数据上下文
    const context = { title: 'hello xiaodong', success: false}
    
    this.fs.copyTpl(tmpl, output, context)
}
```

在自动生成的文件比较多的时候，文件模板可以大大提高生成文件的效率。

## 接收用户输入

对于一些动态的信息，需要跟用户命令行交互获取的信息，比如项目名称。

```js
prompting () {
    // Yeoman 在询问用户环节会自动调用此方法
    // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
    return this.prompt([
        {
            type:'input',
            name: 'title',
            message: 'Your project name',
            default: this.appname // appname 为项目生成目录名称
        }
    ]).then(answers => {
        // answers => { name: 'user input value' }
        console.log(answers)
        this.answers = answers
    })
}
writing () {
    // Yeoman 自动生成文件的阶段调用此方法
    // 我们可以通过文件读写的方式往目录中写文件

    const tmpl = this.templatePath("bar.html")
    const output = this.destinationPath("bar.html")
    const context = this.answers

    this.fs.copyTpl(tmpl, output, context)
}
```

当创建的文件较多的时候，我们可以通过一个数组来存储所有的模板路径，输出路径以及上下文，然后通过遍历的方式将所有的文件根据模板文件创建。

```js
writing () {
    const templates = [
        {
            tmpl:this.templatePath("bar.html"),
            output:this.destinationPath("bar.html"),
            context:this.answers,
        },
        {
            tmpl:this.templatePath("main.js"),
            output:this.destinationPath("main.js"),
            context:this.answers,
        },
    ]

    templates.forEach(item => {
        this.fs.copyTpl(item.tmpl, item.output, item.context)
    })
}
```

## 发布Generator

Generator实际上就是一个npm的模块，发布一个Generator就是发布一个npm的模块。只需要将自己创建的 npm 模块通过 npm public 发布一下就可以了。

一般发布的模块会将代码托管到一个public仓库里面

在运行yarn publish的时候会报错，可能是因为使用的淘宝npm镜像，因为这个镜像是只读的，所以这里publish的时候需要指明一下镜像地址

```
yarn publish --registry=https://registry.yarnpkg.com
```

一个自定义Genetor案例：https://github.com/dingxiaodongaaa/generator-sample