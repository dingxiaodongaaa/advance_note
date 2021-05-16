# Vue.js 组件化开发

## CCD（Component-Driven Development）

  - 自下而上
  - 从组件级别开始，到页面级别结束（从完善的设计中抽象出组件，先隔离开发组件然后开发页面。）

## 涉及知识点介绍
  - 处理组件的边界情况
  - 快速原型开发
  - 组件开发
  - Storybook
  - Monorepo
  - 基于模板生成包的结构
  - Lerna + yarn workspaces
  - 组件测试
  - Rollup打包

## 处理组件的边界情况

  - $root
  - $parent/$children
  - $refs （这个非常典型的一个例子就是在父组件中通过 $refs 对 elementUI 的 form 组件进行表单验证）
  - 依赖注入 provide/inject
  - $attrs / $listeners

### $root $parent $children

在组件中可以通过 $root 访问根实例的成员，通过 $parent 访问负组件的成员，通过 $children 访问子组件的成员。

小型应用中可以在 vue 根实例里存储共享数据，组件中通过 $root 访问根实例，但是当项目的体量变大随之而来的状态变多会使得根实例的状态多的难以维护。这个时候 vuex 就显得非常的有必要。

如果说是一个比较成熟项目，都不建议使用 $parent 或者 $children 访问父组件和子组件，因为这可能会使得组件中状态的变换难以追踪更难以维护。可以通过依赖注入 provide/inject 来解决这个问题。

### $refs

值得强调的是 ref 标记 html 标签，获取的是 html 标签对应的 dom 对象。
ref 标记 vue 组件，获取的是 VueComponent 对象。

### 依赖注入 provide/inject

当组件的嵌套层次比较高的时候，可以使用 provide/inject 在子组件中获取父组件中的成员。

值得注意的是，通过 inject 注入的成员并不是响应式的，所以不能在子组件中直接更改 inject 注入的属性。

它的缺点是，组件之间的耦合性变得很高，子组件完全依赖于父组件，使得重构变得困难。但是开发自定义组件的时候可以使用这种方法。

### $attrs / $listeners

- $attrs
  - 把父组件中传递过来的非 prop 属性通过 v-bind 绑定到子组件中指定的元素上

- $listeners
  - 把父组件中传递过来的原生 dom 事件通过 v-on 绑定到子组件中指定的元素上

*注意：*

1. 从父组件传给自定义子组件的属性，如果没有 prop 接收会自动设置到子组件内部的最外层标签上，如果是 class 和 style 的话，会合并到最外层的 class 和 style。

2. 如果子组件中不想继承父组件传入的非 prop 属性，可以使用 inheritAttrs 禁用继承，然后通过 v-bind="$attrs" 把外部传入的非 prop 属性设置给希望的标签上，但是这不会改变 class 和 style。

3. $listeners 是绑定的 dom 原生事件。

## 快速原型开发

- VueCli 中提供了一个插件可以进行原型快速开发

- 需要先额外安装一个全局的扩展(前题是已经全局安装了vue-cli)
  - npm install -g @vue/cli-service-global

- 使用 vue serve 快速查看组件的运行结果

  - vue serve 如果不指定参数，默认会是在当前目录找以下的入口文件
    - main.js、index.js、App.vue、app.vue

  - 可以指定要加载的组件
    - vue serve ./src/login.vue

### 快速原型开发 & Element-UI

- 初始化 package.json
  - npm init -y

- 安装 ElementUI
  - vue add element（除了安装 element-ui 以外还有 babel 等所以来的插件）

- 加载 ElementUI，使用Vue.use()安装插件

```js
// main.js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Login from './src/Login'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(Login)
})
```

- 运行 vue serve

### 组件分类

- 第三方组件
  
  element-ui、 iview等

- 基础组件

  表单、按钮等

- 业务组件

  结合特定的行业使用场景的组件，可以根据用户的行为产生特定的页面展示给用户，如果要开发的应用对界面要求不高，这个时候可以使用第三方组件，如果对组件的样式有比较高的要求，或者有一套自己使用的标准，这个时候需要开发自己的组件库，开发一套方便团队内部使用的基础组件或者说通用组件。然后使用基础组件开发业务组件，便于相似业务场景不同项目之间的复用。

### Monorepo

两种项目的组织方式

- Multirepo（Multiple Respository）每一个包对应一个项目
- Monorepo（Monolithic Respository）一个项目仓库中管理多个模块/包

### Storybook

- 可视化组件展示平台
- 在隔离的开发环境中，以交互式的方式展示组件
- 独立开发组件

#### Storybook 安装

- 自动安装
  - npx -p @storybook/cli sb init --type vue
  - yarn add vue
  - vue yarn add vue-loader vue-template-compiler --dev

- 手动安装

### yarn workspacces

#### 开启 yarn 工作区

项目根目录的 package.json

```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

#### yarn workspaces 使用

- 给工作区根目录安装开发依赖
  - yarn add jest -D -W
- 给指定工作区安装依赖
  - yarn workspace lg-button add lodash@4
- 给所有的工作区安装依赖
  - yarn install

### Lerna

#### Lerna 介绍
- Lerna 是一个优化使用 git 和 npm 管理多包仓库的工作流工具
- 用于管理具有多个包的 JavaScript 项目
- 它可以一键把代码提交到 git 和 npm 仓库

#### Lerna 使用

- 全局安装
  - yarn global add lerna

- 初始化
  - lerna init

- 发布
  - lerna publish

*注意事项*

1. 发布之前需要关联远程仓库和登录 npm；可以同时把代码发布到 git 和 npm
2. 发布之前最好确认当前配置的镜像源是否正确（淘宝镜像是不行的）
3. 发布完成之后可以在对应包中的 package.json 中查看包的版本号（version）和 git 仓库中最新的 hash 值（gitHead）
```
npm config get registry
```

#### 文件解读

```json
{
  "packages": [ // 管理的包的路径
    "packages/*"
  ],
  "version": "0.0.0" // 项目初始化的版本
}
```

#### lerna 总结

- lerna 只是对包管理器进行了一层包装，对于项目中引用的本地的 package ，则是通过 `fs.symlinkSync(target,path,type)` 来动态的创建对应的软连接，这样在 lerna 中就可以直接进行模块的引入和调试，省去 `npm link` 。
- lerna 用来管理发布包
- yarn workspaces 用来管理包的依赖

### lerna + yarn workspaces

```json
// 顶层的 package.json
{
    "workspaces":[
        "packages/*"
    ]
}
```

```json
// lerna.json
{
  "npmClient": "yarn",  // 指定 npmClient 为 yarn
  "useWorkspaces": true // 将 useWorkspaces 设置为 true
}
```

### Vue 组件单元测试

单元测试的好处

- 提供描述组件行为的文档
- 节省手动测试的时间
- 减少研发新特性时产生的bug
- 改进设计
- 促进重构

#### 安装依赖

- Vue Test Utils // vue 单元测试插件
- Jest // 单元测试包
- vue-jest // vue 单文件组件测试
- babel-jest // 对测试代码进行降级处理

`yarn add jest @vue/test-utils vue-jest babel-jest -D -W`

#### 测试文件的编写

https://cn.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html

### Rollup 打包

- Rollup 是一个模块打包器
- Rollup 支持 Tree-shaking
- 打包的结果比 webpack 要小
- 开发框架/组件库的时候使用 Rollup 更合适

### 基于模板生成包的结构 - plop
