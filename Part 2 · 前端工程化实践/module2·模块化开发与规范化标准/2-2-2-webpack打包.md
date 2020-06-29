# webpack 打包

那对于 ES Modules 的学习，可以从两个维度入手。

1. 了解它作为一个规范或者说标准，到底约定了哪些特性和语法；其次，需要学习如何通过一些工具和方案去解决运行环境兼容带来的问题。

2. 模块化可以帮助我们更好地解决复杂应用开发过程中的代码组织问题，但是随着模块化思想的引入，我们的前端应用又会产生了一些新的问题，比如：

    - 首先，我们所使用的 ES Modules 模块系统本身就存在环境兼容问题。尽管现如今主流浏览器的最新版本都支持这一特性，但是目前还无法保证用户的浏览器使用情况。所以我们还需要解决兼容问题。

    - 其次，模块化的方式划分出来的模块文件过多，而前端应用又运行在浏览器中，每一个文件都需要单独从服务器请求回来。零散的模块文件必然会导致浏览器的频繁发送网络请求，影响应用的工作效率。

    - 最后，谈一下在实现 JS 模块化的基础上的发散。随着应用日益复杂，在前端应用开发过程中不仅仅只有 JavaScript 代码需要模块化，HTML 和 CSS 这些资源文件也会面临需要被模块化的问题。而且从宏观角度来看，这些文件也都应该看作前端应用中的一个模块，只不过这些模块的种类和用途跟 JavaScript 不同。

对于开发过程而言，模块化肯定是必要的，所以我们需要在前面所说的模块化实现的基础之上引入更好的方案或者工具，去解决上面提出的 3 个问题，让我们的应用在开发阶段继续享受模块化带来的优势，又不必担心模块化对生产环境所产生的影响。

接下来我们先对这个更好的方案或者工具提出一些设想：

- 第一，**新特性代码编译** 它需要具备编译代码的能力，也就是将我们开发阶段编写的那些包含新特性的代码转换为能够兼容大多数环境的代码，解决我们所面临的环境兼容问题。

- 第二，**模块化 JavaScript 打包**能够将散落的模块再打包到一起，这样就解决了浏览器频繁请求模块文件的问题。这里需要注意，只是在开发阶段才需要模块化的文件划分，因为它能够帮我们更好地组织代码，到了实际运行阶段，这种划分就没有必要了。

- 第三，**支持不同种类的前端模块类型**，也就是说可以将开发过程中涉及的样式、图片、字体等所有资源文件都作为模块使用，这样我们就拥有了一个统一的模块化方案，所有资源文件的加载都可以通过代码控制，与业务代码统一维护，更为合理。

针对上面第一、第二个设想，我们可以借助 Gulp 之类的构建系统配合一些编译工具和插件去实现，但是对于第三个可以对不同种类资源进行模块化的设想，就很难通过这种方式去解决了，所以就有了我们接下来要介绍的主题：前端模块打包工具。

## webpack 基本使用

webpack4.0 以上的版本支持0配置打包,我们只需要下载webpack的依赖运行就可以实现简单的打包。

```
yarn add webpack webpack-cli --dev
yarn webpack --version
yarn webpack
```

命令行执行上述代码,webpack 就会以 src/index.js 为入口打包到 dist/main.js 中。

## webpack 配置

根目录下新建一个 webpack.config.js 这个文件是运行在 node 环境中的一个配置文件。

```js
const path = require('path')

module.exports = {
    entry: './src/main.js',  // 入口文件
    output: {
        filename: 'bundle.js',  // 出口文件
        path: path.join(__dirname, 'output')  // 出口文件保存目录
    }
}
```

## webpack 工作模式 mode

- develop （优化打包速度）
- production （默认，优化打包代码执行速度）
- none （只会打包，不会做任何额外的处理）

可以在配置文件中添加一个mode属性来配置模式，也可以在运行命令的时候手动传入mode参数。

## webpack 打包结果运行原理

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200624153637883.png)

webpack 打包生成的代码是一个立即执行函数，这个函数是 webpack 的工作入口，接收一个叫作 modules 的参数，调用的时候传入一个数组。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020062415394891.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

数组中的每一个元素都是一个传入参数列表相同的函数，一个函数对应的源代码的中一个模块，也就是说，每一个模块最终都会被包裹到这样一个函数中，从而去实现模块的私有作用域。

## webpack 资源模块加载

webpack 默认只会处理js文件，所以它会在打包的过程中将所有的文件都作为js文件解析，所以如果入口文件配置为全是css代码的css文件，就会打包报错。所以这个时候就需要使用专门的资源加载器（loader）去加载对应的资源。webpack内部的loader只会去处理js文件。

比如说，解析css文件就需要使用css-loader，css-loader的作用就是将css文件转换成一个js模块，具体的实现就是将css代码push到一个数组中，但是它并不会将打包之后的css注入到页面中，所以还需要一个style-loader，将打包后的css追加到页面中。

配置文件如下
```js
const path = require('path')

module.exports = {
    mode: 'none',
    entry: './src/main.css',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}
```

注意当rules是一个数组的时候，数组中的加载器是从后面往前的顺序处理文件的。

loader是webpack资源模块加载的核心，通过不同的loader可是实现对不同类型资源的打包。

上面的例子也只是一个尝试，webpack的打包入口在大多数情况下还是js文件，因为项目的打包入口也可以说是应用的运行入口，前端应用的业务又是由js驱动的。所以多数情况下还是使用js文件为入口，然后再js文件中使用import去引入其他类型的资源文件。

## 文件资源加载器

既然所有类型的资源文件都是通过js文件引入然后通过loader去加载的，那么图片或者字体这种的文件是不能通过js的方式去表示的，这类的资源文件，我们需要使用文件资源加载器（file-loader）。

文件加载器的工作过程：webpack再打包时遇到了图片资源文件，然后根据配置文件中的配置，匹配到对应的文件加载器，文件加载器开始工作，显示将我们导导入的文件拷贝到输出目录然后将拷贝后的文件路径作为当前模块的返回值返回，这样对于应用来说所需要的资源就被发布出来了，同时可以通过模块的导出成员获取到他的访问路径。

## URL 加载器

Data URLs是一种特使的url协议，它可以用来直接去表示一个文件，传统的url一般要求服务器上有一个对应的文件，然后通过文件的地址请求到服务器上对应的文件。但是Data URLs 是一种直接使用url去表示文件内容的一种方式，即url的文本已经包含了文件的内容，所以使用这种url的时候就不需要去发送http请求。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020062512205513.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

再webpack打包的时候可以使用这种方式去实现资源文件的引入，这样就可以使用代码的形式去表示任意类型的文件了，可以使用url-loader。

对于图片资源的正确的打包方式应该是：

1. 对于体积小的使用url-loader去加载，减少请求次数；
2. 体积大的使用file-loader去加载，提高加载速度；

因为体积大的文件使用url-loader转换之后会增加打包后的代码的体积，应用的加载速度变慢影响运行速度。

- 项目中超过10KB文件单独提取存放
- 小于10KB文件转换为Data URLs嵌入代码中

```js
const path = require('path')

module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /.png$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024 // 10KB
                    }
                }
            }
        ]
    }
}
```

## webpack 常用加载器分类

### 1. 编译转换类

这个类型的loader会将加载到的资源模块转换为js代码，例如css-loader。

### 2. 文件操作类

将加载到的资源模块拷贝到输出目录，同时将文件的访问路径导出，例如file-loader。

### 3. 代码检查类

对加载到的资源文件，一般是代码去进行校验的加载器，目的是为了统一代码的风格，提高代码质量，这种加载器不会影响到代码。

## webpack 与 2015

webpack因为模块打包需要，所以会处理import和export，但是他并不能去转换代码当中其他的ES6特性。

```js
{
    test: /.js$/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    }
},
```

webpack 只是一个打包工具，不会去处理代码，需要使用加载器去实现。

## webpack 模块加载方式

除了代码中的 import 可以触发模块的加载，webpack还提供了其他几种方式。

- 遵循 ES Mudles 标准的 import 声明
- 遵循 CommonJS 标准的 require 函数 （注意，对于ESM的默认导出需要使用default属性去获取，`require('./heading.js').default`）
- 遵循 AMD 标准的 define 函数和 require 函数 

*除非必要，否则不要去使用混合的方式*

除了JS代码中的这三种方式以外，还有一些独立的加载器在工作的时候也会去处理加载到的资源中的一些导入的模块，比如：
- 样式代码中的@import指令和url函数
- HTML代码中的图片标签的src属性

```js
{
    test: /.html$/,
    use: {
        loader: 'html-loader',
        options: {
            attrs: ['img:src', 'a:href']
        }
    }
}
```

## webpack 核心工作原理

webpack 通过配置找到项目打包的入口（一般是js文件），根据代码中出现的 import require 之类的语句，解析出文件所需要依赖的资源模块，然后去解析每一个资源模块对应的依赖，最后得到一个依赖关系树。然后 webpack 会递归遍历这个依赖树，找到每个节点所对应的资源文件，然后根据配置文件中的 rules 属性找到模块对应的加载器，交给对应的加载器去加载这个模块，最后将打包后的结果放到 output 配置的目录文件中，实现整个项目的打包。

## webpack loader的工作原理

## webpack 插件机制

loader 专注实现资源模块加载，从而实现整体项目的打包。Plugin 解决除了资源加载以外的其他的一些自动化的工作，例如，打包之前自动清除dist目录；自动拷贝不需要打包的资源文件到输出目录；压缩打包结果输出的代码。

## webpack 插件使用总结

- clean-webpack-plugin
- html-webpack-plugin
- copy-webpack-plugin

## plugin 工作原理

plugin 通过钩子机制实现，webpack 会给项目打包的过程中分为很多个环结，再这些环节的中间可以添加一些额外的操作，易扩展 webpack 的能力。

webpack 要求插件必须是一个函数或者是一个包含 apply 方法的对象。一般都会把一个插件定义为一个类型，然后再这个类型中定义一个 apply 方法，使用的时候就是使用这个类型去构建一个实例.

### 一个简单的webpack plugin

开发一个自定义的 plugin ,自动的删除js文件中的的注释

```js
class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      for(const name in compilation.assets) {
        // console.log(name)
        // console.log(compilation.assets[name].source())
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const widthoutComments = contents.replace(/\/\*\*+\*\//g, '')
          compilation.assets[name] = {
            source: () => widthoutComments,
            size: () => widthoutComments.length
          }
        }
      }
    })
  }
}
plugins: [
    new MyPlugin()
]
```

## webpack 开发体验问题

1. 以 HTTP Server 运行

以HTTP Server 的形式运行而不是以文件的方式运行。这样可以更加接近生产环境的状态，可以支持ajax访问

2. 自动编译 + 自动刷新

3. 提供 Source Map 支持

### 自动编译

监听文件的变化，自动运行打包任务。

实现方式，再启动webpack打包命令的时候传递一个watch的参数。yarn webpack --watch，这样webpack 就会一个监听模式去运行，打包完成之后 cli 不会立即退出，它会等待文件的变化然后再次工作一直到手动的结束 cli 。这样就可以只专注于编码，不比管那些手动重复的工作。

### 自动刷新 Browser sync

```
browser-sync dist --files "**/*"
```

上面的实现自动编译自动刷新虽然实现了想要的效果，但是其使用相对复杂，而且效率相对较低，因为webpack需要将打包后的文件写入磁盘，然后browser-sync再从磁盘中读取，磁盘的操作过多影响效率。

## Webpack Dev Server

提供一个开发服务器，集成自动编译和自动刷新浏览器等一系列对开发友好的功能。

webpack-dev-server 是将打包结果存放在内存中，内部的http server把这些文件从内存中读出来然后发送给浏览器，减少了很多不必要的磁盘读写操作，提高构建效率。

webpack-dev-server 默认会把打包的输出文件作为server的资源文件，只要是webpack打包能够输出的文件都可以正常被访问，但是静态资源也需要作为开发资源被server访问就需要额外的去告诉webpack dev server 。再webpack配置文件中配置devServer。

```js
devServer: {
    contentBase: ['public']
}
```

### Webpack Dev Server 代理 API

在实际的开发环境中存在请求跨域的问题，可以使用跨域资源共享（CORS）的方式去解决这个问题，但是使用CORS的前提是API必须支持。

### 解决开发阶段的接口跨域问题

在开发环境中配置代理服务，把接口服务代理到本地的开发服务器上。

Webpack Dev Server 支持配置代理

#### 目标：将github api代理到开发服务器

```js
devServer: {
    contentBase: ['public'],
    proxy: {
        '/api': {
            target: 'https://api.github.com',
            pathRewrite: {
            '^api': ''
            },
            changeOrigin: true
        }
    }
},
```

## Source Map 介绍

通过上述自动编译和自动刷新的流程之后，浏览器中的运行代码就会和开发过程中的源代码有很大的差异，这就非常不利于我们开发过程中的调试工作，以及运行中的错误定位变得很麻烦。因为调试或者是报错都是基于运行代码。source map（源代码地图）就可以很好的解决这类问题。它会给运行代码和源代码添加一个映射关系，通过这个映射关系可以很容易的在源代码中找到运行代码对应的位置。

### webpack配置source map

在配置文件中添加配置项devtool

```js
{
    devtool: 'source-map',
}
```

### webpack eval 模式的 Source Map

这种模式下不会生成source map文件，打包后的文件中的js代码会是一个字符串通过eval执行，并且再字符串的最后使用`//# sourceUrl=webpack:///./src/main.js?`来标记当前的js代码是来源于哪个文件。所以说这种构建速度是最快的，但是这种只能定位源代码的文件名称不能定位源代码的具体行列位置。

### 不同devtool之间的差异

- eval-source-map

这种方式也是使用eval去执行js代码，而且也会生成source-map文件，所以可以定位错误出现的文件也可以定位错误的行列信息。

- cheap-source-map

阉割版的source-map，这种模式下，错误只能定位到行不能定位列信息。但是生成速度会比source-map快很多。

- cheap-module-source-map

这种模式下的代码也是可以将错误定位到行但是不能定位到列的。而且这种模式下打包出来的代码是和源代码一模一样的，babel等不会对代码进行转换

- inline-source-map

这种模式和普通的source-map效果是一样的，source-map的source-map文件是以物理文件的形式存在，而inlinie-source-map使用的是dataUrl的方式将source-map以dataUrl嵌入到代码中。

这种方式把源代码放到了打包后的代码中，是的打包后的文件体积非常的大，所以基本不会用到。

- hidden-source-map

这个模式是会生成source-map文件的，但是不会在代码中引入这个source-map文件，所以在开发工具中看不到效果。这种模式在开发第三方包的时候会比较有用。

- nosources-source-map

这个模式下能看到错误出现的位置，但是点击错误信息是看不到源代码的。这种就是没有源代码只会提供行列信息。为了在生产环境中保护源代码不被暴露。

### 选择 Source Map 模式

1. 开发环境下（汪磊的建议）

*cheap-module-eval-source-map*

- 代码每行不会超过80个字符，所以能定位到行就够了。
- 代码经过Loader转换过后的差异较大。所以需要调试转换之前的代码。
- 首次打包速度慢无所谓，重写打包相对较快。

2. 生产环境下

*none*

- Source Map会暴露源代码到生产环境。
- 调试是开发阶段的事情。在开发阶段就得把可能出现的问题发现并修复。

如果是对打包后的代码缺乏信心，可以选择使用*nosources-source-map*

- 这种模式下可以找到源代码中的位置，但是又不至于暴露源代码内容。

理解不同模式的差异，适配不同的环境！

## webpack 自动刷新的问题

前面使用webpack-dev-server实现的自动刷新还会存在一些开发时会遇到的不方便的问题。因为每次修改代码之后，浏览器的页面都会去自动刷新，所以不能在保持之前的页面状态不变的前提下使页面响应最新修改的代码。这样每次修改之后，等页面刷新完，就还需要再去恢复页面之前的状态。

问题的核心：自动刷新导致页面的状态丢失。

提出的设想： 页面不刷新，模块及时更新。

### webpack HMR

Hot Module Replacement（模块热更新）

热更新和自动更新的差别就是，自动更新会将整个页面重新刷新，热更新可以实现页面的模块局部更新。

HMR使webpack最强大的功能之一同时也是最受欢迎的一个特性。

### 开启HMR

HMR已经集成在了webpack-dev-server中，所以说不需要单独安装。开启服务的时候传入参数hot就可以开启HMR

```
yarn webpack-dev-server --hot
```

也可以在配置文件中去配置

*第一步*

```
devServer:{
    hot: true
}
```

*第二步*

引入webpack中内置的一个模块

```js
const webpack = require('webpack')

{
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

这样实现完了热替换之后，发现更改css样式文件可以是实现局部刷新的效果，但是当更改js代码之后，页面就会整个页面刷新。

Webpack 中的 HMR 并不能开箱即用，需要手动处理模块热替换逻辑。

前面的样式文件成功实现了热更新，是因为style-loader自动的处理了热更新的逻辑，所以不需要我们手动的处理。

为什么样式文件可以自动处理，但是js文件却只能收到处理呢？

原因就是样式文件更新之后只需要将样式文件替换到页面当中就可以覆盖掉之前的样式实现样式文件的更新。但是编写的js文件代码是没有任何规律的，因为一个模块可能导出的是一个对象也可能使一个字符串也有可能是一个函数，模块的使用也是各不相同，所以js的代码相对于样式文件就显得毫无规律。不知道如何去处理更新后的模块。所以js的热更新处理逻辑永远不可能有通用的。

### HMR APIs

使用HMR APIs手动配置js文件更新过后的热替换逻辑

module对象的hot属性使HMR APIS的核心对象。

`module.hot.accept()` 用于注册当某一个模块更新过后的处理函数，第一个参数使依赖模块的路径，第二个参数是依赖路径更新过后的处理函数。

```js
// ============ 以下用于处理 HMR，与业务代码无关 ============

if (module.hot) {
  let lastEditor = editor
  module.hot.accept('./editor', () => {
    // console.log('editor 模块更新了，需要这里手动处理热替换逻辑')
    // console.log(createEditor)

    const value = lastEditor.innerHTML
    document.body.removeChild(lastEditor)
    const newEditor = createEditor()
    newEditor.innerHTML = value
    document.body.appendChild(newEditor)
    lastEditor = newEditor
  })

  module.hot.accept('./better.png', () => {
    img.src = background
    console.log(background)
  })
}
```

## webpack 生产环境优化

webpack4 的mode就是为了生产环境优化，我们也应该为不同的工作环境创建不同的配置。

### webpack不同工作环境下的配置

1. 配置文件根据环境不同导出不同的配置
2. 一个环境对应一个配置

#### 配置文件根据环境不同导出不同的配置

webpack配置文件支持导出的是一个函数，这个函数有两个参数，第一个参数 env 是 cli 传递的一个环境名参数，第二个是 argv 是 cli 运行是所传递的所有的参数。

```js
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const config = {
    mode: 'development',
    entry: './src/main.js',
    output: {
      filename: 'js/bundle.js'
    },
    devtool: 'cheap-eval-module-source-map',
    devServer: {
      hot: true,
      contentBase: 'public'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack Tutorial',
        template: './src/index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  }

  if(env === 'production') {
    config.mode = 'production',
    config.devtool = false,
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(['public'])
    ]
  }

  return config
}
```

这种分类配置方式也只是用于中小型的项目。如果项目过大最好还是使用多文件配置

#### 多文件配置

一般分为三个配置文件，一个配置文件时通用配置，一个是生产配置，一个是开发配置。

Object.assign() 会将对象中的同名属性直接覆盖掉所以这里使用它合并配置对象并不合适。webpack-merge 专门合并配置对象。

合并完成之后可以执行命令 `yarn webpack --config webpack.prod.js` `yarn webpack --config webpack.dev.js` `yarn webpack-dev-server --config webpack.dev.js`

### DefinePlugin

DefinePlugin 是为我们的代码注入全局成员的，在production模式下 ，默认这个插件就会启用，并且往代码中注入了`process.env.NODE_ENV`

```js
const webpack = require('webpack')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      API_BASE_URL: JSON.stringify('https://api.example.com')
    })
  ]
}
```
DefinePlugin 这个类接收一个对象作为参数，这个对象里面的每一个键值都会被注入到代码中。

需要注意的是，对象参数里面的值需要是一个js代码片段，需要符合js的语法规范。 如果是一个值可以使用JSON.stringify。

### Tree Shaking

自动检测出代码中未引用的代码然后移除他们。它会在生产模式下自动的开启。

注意：Tree Shaking并不是webpack中的某一个配置选项，而是一些配置项的组合使用。

```js
module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  // 优化代码的配置项
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 尽可能合并每一个模块到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    minimize: true
  }
}
```
 
这里的 usedExports 就相当于将代码树种的枯叶（为引用的代码）做标记，然后 minimize 的作用就是将枯叶摇掉。

concatenateModules 尽可能地将每一个模块合并到输出到一个函数中，既提升了运行效率，由减少了代码体积。

### Tree Shaking & Babel

首先需要明确一点，Tree Shaking 的前提就是必须使用ES Modules组织代码，也就是说，我们交给webpack打包的代码必须是使用ESM实现的模块化。

如果我们在使用@babel/preset-env对代码进行转换之后，代码中的EMS的语法就会被转换成CommonJS的语法，所以Tree Shaking就会失效。

**但是**在最新版本的babel-loader中会自动地关闭ESM到CommonJS地转换，所以使用Tree Shaking也就不会失效。

### sideEffects 副作用

副作用是指模块执行时除了导出成员之外所做的事情，sideEffects 一般用于 npm 包标记是否有副作用。

package.json中标记没有副作用的代码

```js
"sideEffects": [
    "./src/extend.js",
    "*.css"
]
```

webpack.config.js中开启属性（这个属性在prod模式下也会自动开启）

```js
optimization: {
    sideEffects: true,
    // 模块只导出被使用的成员
    // usedExports: true,
    // 尽可能合并每一个模块到一个函数中
    // concatenateModules: true,
    // 压缩输出结果
    // minimize: true,
}
```

开启之后，webpack打包的时候就会将没有副作用的且没用被用到的模块移除掉。

### webpack 代码分割

通过webpack实现前端模块化的优势固然很明显，但是它同样存在一些弊端，项目中的所有的代码都会被打包到一起，如果应用非常的复杂，模块非常多bundle的体积就会非常大。但是事实上在应用启动的时候并不是所有的模块都是必要的，但是这些模块都被打包到一起，需要的任何一个模块都需要把整体加载下来之后才能使用，这就会浪费很多的流量和带宽。解决这个问题的方法就是把打包结果按照一定的规则分离到多个bundle中，然后根据应用的运行需要，按需加载模块，这样就可以大大提高应用的响应速度和运行效率。

代码分割（Code Splitting）

代码分割或者代码分包的方式：

- 多入口打包
- 动态导入

#### 多入口打包

多入口打包一般适用于多页面应用程序，基本规则就是一个页面对应一个打包入口，对于不同页面之间的公共的部分再去提取到公共的部分中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    mode: 'none',
    entry: {
        'index': './src/index.js',
        'album': './src/album.js'
    },
    output: {
        filename: '[name].bundle.js'
    },
    module:{
        rules:[
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.png|jpe?g|gif$/,
                use: {
                    loader:'url-loader',
                    options:{
                        limit:  10 * 1024
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'index page',
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            title: 'album page',
            template: './src/album.html',
            filename: 'album.html',
            chunks: ['album']
        })
    ]
}
```

多入口打包还存在一个问题，就是不同的打包入口中会有公共模块，按照前面的打包配置不同的包中会有相同的模块出现。所以需要打包优化配置项中添加`splitChunks`项

```js
optimization: {
    splitCkunks:{
        chunks: 'all'
    }
}
```

#### 动态导入

动态导入，按需加载，提高运行效率节省带宽和流量。所有的动态导入的模块都会被自动分包。相对于多入口分包，动态导入的方式会更加的灵活，因为我们可以使用代码的逻辑来控制模块的加载以及加载时机。

```js
// import posts from './posts/posts'
// import album from './album/album'

const render = () => {
  const hash = window.location.hash || '#posts'

  const mainElement = document.querySelector('.main')

  mainElement.innerHTML = ''

  if (hash === '#posts') {
    // mainElement.appendChild(posts())
    import(/* webpackChunkName: 'components' */'./posts/posts').then(({ default: posts }) => {
      mainElement.appendChild(posts())
    })
  } else if (hash === '#album') {
    // mainElement.appendChild(album())
    import(/* webpackChunkName: 'components' */'./album/album').then(({ default: album }) => {
      mainElement.appendChild(album())
    })
  }
}

render()

window.addEventListener('hashchange', render)
```

webpack 的魔法的注释可以给动态导入自动分包的包名进行自定义名称。就是上面代码中的`/* webpackChunkName: 'components' */`。这种语法叫做魔法注释，另外，如果声明的chunkName是相同的，他们就会被打到一个包里面。

### MiniCssExtractPlugin 提取css到单个文件

通过这个插件可以实现css的按需加载，前面css打包使用css-loader和style-loader，css-loader是将css文件进行解析打包，style-loader是将打包后的css样式注入到html页面中。

而 MiniCssExtractPlugin 这个插件的作用就是将css打包到一个单独的文件，然后再html页面中使用引入页面的方式将打包后的文件引入到html中，所以如果使用了这个插件，就不需要使用style-loader这个加载器了。

事实上，如果css代码不是非常大的话，也不需要单独打包到一个文件，直接注入到html中减少一起请求效果会更好。

### OptimizeCssAssetsWebpackPlugin 压缩输出的 css 文件

使用 MiniCssExtractPlugin 将css提取到单个文件之后，使用生产模式打包，css文件代码还是不会被压缩，这是因为webpack默认只是会压缩js代码，而其他文件的压缩都需要额外的插件支持。webpack提供了这样一个专门压缩css文件的插件 optimize-css-assets-webpack-plugin。

## webpack 输出文件名hash

部署前端的资源文件时，都会启用前端的静态资源文件缓存，所以对于用户的浏览器而言会缓存应用中的静态资源，后续就不需要请求了，响应速度就会大幅提升。但是开启缓存还会有问题，如果设置的缓存时间过短的话效果就不是特别明显，如果过期时间设置的过长，一旦应用部署更新之后，又不能及时更新到客户端，为了解决这个问题，在生产模式下需要给文件添加文件hash值，这样，一旦文件发生改变，文件名称也会跟着一起发生改变，对于客户端而言，全新的文件名就是全新的请求就没有混存的问题。

### 方式一

```js
output: {
    filename: '[name]-[hash].bundle.js'
},
```

这种方式添加的hash值时项目级别的，也就是说只要项目中只要有任何一个文件发生变化，下一次打包之后的文件的hash值都会发生变化。

### 方式二

```js
output: {
    filename: '[name]-[chunkhash].bundle.js'
},
```

chunkhash是局部块更新，之后和改变的模块有关联的文件的hash才会再下一次打包之后发生变化。

### 方式三

```js
output: {
    filename: '[name]-[contenthash].bundle.js'
},
```

文件级别的hash，根据输出文件的内容生成的hash值，只要是不同的文件就有不同的hash值。同样的，更改代码之后的下一次打包，文件hash发生变化的就只有文件内容和之前有不同的文件。

另外可以通过冒号数字的方式指定hash的长度，默认是20位。

```js
output: {
    filename: '[name]-[contenthash:8].bundle.js'
},
```

汪磊说，控制缓存的话，8位的hash是最好的选择，咱也不知道为什么（大神说的都对），就先记下来。
