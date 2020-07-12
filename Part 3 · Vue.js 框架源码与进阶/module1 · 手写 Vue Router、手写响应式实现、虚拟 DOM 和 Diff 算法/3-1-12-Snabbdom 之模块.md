# 模块

snabbdom 的核心库并不能处理元素的属性/样式/事件等，如果处理需要使用模块。

## 常用模块

官方提供的 6 个模块

  - attributes

    - 设置 DOM 元素的属性，使用 setattribute()
    - 处理布尔类型的属性

  - props

    - 和 attributes 模块相似，设置 DOM 元素的属性 element[attr] = calue
    - 不处理布尔类型的属性

  - class

    - 切换类样式
    - 注意：给元素设置样式是通过 sel 选择器

  - dataset

    - 设置 data-* 的自定义属性

  - eventlisteners

    - 注册和移除事件

  - style

    - 设置行内样式，支持动画
    - delayed/remove/destroy

## 模块的使用

模块使用步骤

  - 导入需要的模块
  - init() 中注册模块
  - 使用 h() 函数创建 VNode 的时候，可以把第二个参数设置为对象，其他参数往后移

```js
import { init, h } from "snabbdom"
// 1. 导入模块
import style from "snabbdom/modules/style"
import eventlistener from "snabbdom/modules/eventlisteners"
// 2. 注册模块
let patch = init([
  style,
  eventlistener
])
// 3. 使用 h() 函数的第二个参数传入模块需要的数据（对象)
let vnode = h("div#container", {
  style: {
    // 如果是两个单词的属性，需要使用驼峰式
    backgroundColoer: 'red'
  },
  on: {
    click: eventHandler
  }
}, [
  h("h1", "大标题"),
  h("p", "标题描述")
])

function eventHandler () {
  console.log("点击我了")
}

let app = document.querySelector("#app")

patch(app, vnode)
```