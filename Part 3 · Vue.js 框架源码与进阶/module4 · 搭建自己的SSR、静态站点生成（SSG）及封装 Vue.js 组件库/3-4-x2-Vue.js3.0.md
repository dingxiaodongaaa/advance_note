# Vue.js 3.0

- 源码组织方式的变化（Monorepo）
- Composition API（解决 vue2.x 超大组件optionsAPI难以拆分重用的问题）
- 性能提升（proxy响应式优化，虚拟 dom update 性能提升）
- Vite（开发阶段不需要打包直接可以运行项目，提高开发效率）

## 源码的组织方式

- 源码采用 TypeScript 重写
- 使用 Monorepo 管理项目结构

## Composition API

- RFC(Request For Comments)
  - https://github.com/vuejs/rfcs
- Composition API RFC
  - https://composition-api.vuejs.org

### 设计动机

- Options API
  - 包含一个描述组件选项（data、methods、props等）的对象
  - Options API 开发复杂组件，同一个功能逻辑的代码被拆分到不同选项

## 响应式系统升级

- Vue.js 2.x 中响应式系统的核心 defineProperty
- Vue.js 3.0 中使用 Proxy 对象重写响应式系统
  - 可以监听动态新增的属性
  - 可以监听删除的属性
  - 可以监听数组的索引和 length 属性

## 编译优化

- Vue.js 2.x 中通过标记静态根节点，优化 diff 的过程
- Vue.js 3.0 中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容
  - Fragments （升级 vetur 插件）
  - 静态提升
  - Path flag
  - 缓存事件处理函数

## 优化打包体积

- Vue.js 3.0 中移除了一些不常用的 API
  - 例如： inline-template、filter等
- Tree-shaking（依赖esm、trasition）

## Vite

### ES Module

- 现代浏览器都支持 ES Module（IE 不支持）
- 通过下面的方式加载模块
  - `<script type="module" src="..."></script>`
- 支持模块的 script 默认延迟加载
  - 类似于 script 标签设置 defer
  - 在文档解析完成后，触发 DOMContentLoaded 事件前执行

### Vite as Vue-CLI

Vite 使用 script 标签 type="module" 的方式加载js

- Vite 在开发模式下不需要打包可以直接运行
- Vue-CLI 开发模式下必须对项目打包才可以运行

Vite 会开启一个服务器拦截浏览器发送的请求，浏览器向服务器发送请求获取相应的模块，碰到浏览器不能识别的文件会进行编译。比如说 vue 单文件组件，服务器会通过 compiler-sfc 将vue 文件编译成 render 函数，然后返回给浏览器。