# Snabbdom 的基本使用

## 创建项目

- 打包工具为了方便使用 parcel
- 创建项目，并安装 parcel

```
md snabbdom-demo
cd snabbdom-demo
yarn init -y
yarn add parcel-bundler
```

- 配置 package.json 的 scripts

```json
"scripts": {
  "dev": "parcel index.html --open",
  "build": "parcel build index.html"
}
```

- 创建目录结构

```text
├── index.html
├── package.json
└── src
    └── 01-basicusage.js
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>snabbdom-demo</title>
</head>
<body>
  <div id="app"></div>
  <script src="./src/01-basicusage.js"></script>
</body>
</html>
```

## 导入 Snabbdom

Snabbdom 文档

- 看文档的意义

    - 学习任何一个库都要先看文档
    - 通过文档了解库的作用
    - 看文档中提示的示例，自己快速实现一个 demo
    - 通过文档查看 API 的使用

- 文档地址

    - https://github.com/snabbdom/snabbdom
    - [中文翻译](https://github.com/coconilu/Blog/issues/152)

- 导入

    - Snabbdom 的官网 demo 中导入使用的时 commonjs 模块语法，我们使用更流行的 ES6 模块化的语法

    - 关于模块化的语法请参考 [module的语法](https://es6.ruanyifeng.com/#docs/module)

    - [ES6 模块与 CommonJS 模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

    ```js
    import { h, thunk, init } from 'snabbdom'
    ```

    - Snabbdom 的核心仅提供最基本的功能，只导出了三个函数 init()、h()、thunk()

        - init() 是一个高阶函数，返回 patch()
        - h() 返回虚拟节点 VNode,这个函数我们在使用 Vue.js 的时候见过
        ```js
        new Vue({
          router,
          store,
          render: h => h(App)
        }).$mount('#app')
        ```
        - thunk() 是一种优化策略，可以在处理不可变数据时使用

    - **注意：** 导入时候不能使用 `import snabbdom from 'snabbdom'`

        - 原因：node_modules/src/snabbdom.ts 末尾导出使用的语法是 export 导出 API，没有使用 `export default` 导出默认输出

    ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200710202846664.png)

## 基本使用

介绍snabbdom 中的 h() init() patch() 函数的使用

```js
import { h, init } from 'snabbdom'

// 1. hello world
// 参数：数组，模块
// 返回值：patch 函数，作用对比两个 vnode 的差异更新到真实 dom
let patch = init([])

// 第一个参数，标签加选择器
// 第二个参数，如果是字符串的话就是标签中的内容
let vnode = h("div#container.cls", "Hello World")

let app = document.querySelector('#app')

// 第一个参数：可以是 DOM 元素，内部会把 DOM 元素转换成 VNode
// 第二个参数： VNode
let odlVnode = patch(app, vnode)

// 假设的时刻，在这个时刻我们要从服务器获取数据，并把数据更新到创建好的 div 中

vnode = h("div", "服务端数据")

patch(odlVnode, vnode)
```


```js
// 2. div 中放置子元素 h1 p
import { h, init } from "snabbdom"

let patch = init([])

let vnode = h("div#container", [
  h("h1#firstTitle", "大标题"),
  h("p#titleState", "标题描述")
])

let app = document.querySelector("#app")

let oldNode = patch(app, vnode)

// 元素替换
setTimeout(() => {
  vnode = h("div#container", [
    h("h1", "hello world"),
    h("p", "hello p")
  ])
  patch(oldNode, vnode)
}, 2000)

// 元素清空
setTimeout(() => {
  // 官网中错误的解决方案
  // patch(oldNode, null)
  patch(oldNode, h("!"))
}, 2000)
```
