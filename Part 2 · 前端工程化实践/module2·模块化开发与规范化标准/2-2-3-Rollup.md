# Rollup

Rollup也是一款ESM的打包器，也可以将一些散落的模块打包成整块的代码，从而使得这些划分的模块可以更好的运行再浏览器环境或者nodejs环境。

相比于webpack，rollup要小巧的多，webpack可以配合插件实现前端工程化的绝大多部分工作，但是 rollup 只是一个 ESM 打包器，并没有任何其他额外的功能。他的出现也只是为了提供一个充分利用 ESM 各项特性的高效打包器。

## 快速上手

```
yarn add rollup --dev
yarn rollup ./src/index.js --format iife --file dist/bundle.js
```

默认会开启tree shaking优化代码

## rollup 配置文件

这个文件会运行在node环境中，但是rollup会单独的处理这个配置文件，所以这里面可以直接使用ESM。

```js
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  }
}
```

执行命令

```
yarn rollup --config
```

必须指明config参数，因为默认不会使用配置文件的配置。

## rollup使用插件

rollup自身就只是对ESM打包，如果想要加载其他类型的资源文件或者是导入CommonJS模块，或者是遍历ECMAScript新特性。rollup就需要使用插件去扩展实现。而且插件是rollup唯一的扩展途径，不象webpack有loader、plugin的方式。

## rollup加载npm模块

rollup默认只能按照文件路径的方式去加载本地文件模块，对于node_modules中的第三方模块并不能像webpack一样直接通过模块的名称导入模块。

rollup官方给出了 `rollup-plugin-node-resolve` 这个插件。通过使用这个插件，就可以再文件中直接使用模块名称去导入对应模块。

## 加载CommonJS模块

在rollup中默认支持的使ESM，而CommonJS是不被支持的。但是目前还是有大量的npm模块使用CommonJS的方式去导出成员，所以为了兼容这些模块，官方给出了一个插件`rollup-plugin-comminjs`。

## rollup代码拆分

在rollup中依然可以使用动态导入的方式实现代码拆分。

```js
export default {
  input: 'src/index.js',
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife'
    dir: 'dist',
    format: 'amd'
  }
}
```

## 多入口打包

```js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd'
  }
}
```

因为要在浏览器中运行，所以这里使用的是amd的模式。对于amd这种输出格式的文件不能直接去引用到页面上，必须要使用通过实现amd标准的库去加载。

```html
<!-- index.html -->
<script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="foo.js"></script>
```

*requireJS使用data-main参数声明require加载的入口模块路径*

## rollup选用原则

- 输出结果更加扁平
- 自动移除未引用的代码（Tree Shaking）
- 打包结果依然完全可读

- 加载非ESM的第三方模块比较复杂（需要配置插件）
- 模块最终都被打包到一个函数中，无法实现HMR
- 浏览器环境中，代码拆分功能依赖AMD库

综上优缺点，大多数知名的框架/库都在使用Rollup，因为框架或者类库他们很少引用第三方模块。但是如果是开发一个项目会引用大量的第三方模块，规模比较大的还需要使用代码分包，这样的就需要使用webpack。

应用程序使用webpack，框架或者类库使用rollup

# Parcel

一款零配置的前端应用打包器

