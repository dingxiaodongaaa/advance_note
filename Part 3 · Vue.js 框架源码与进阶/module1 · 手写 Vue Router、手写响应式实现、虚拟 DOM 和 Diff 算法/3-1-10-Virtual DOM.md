# Virtual DOM 

- 了解什么是虚拟 DOM ，以及虚拟 DOM 的作用
- Snabbdom 的基本使用
- Snabbdom 的源码解析

## 什么是虚拟 DOM ？

- Virtual DOM （虚拟 DOM）是由普通的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM

由于真实 DOM 的成员非常的多，所以创建一个 DOM 对象的成本是非常高的。如果用一个普通的 JS 对象来描述真实 DOM 就会节省大量的开销。

## 为什么使用虚拟 DOM

- 手动操作 DOM 比较麻烦，还需要考虑兼容性的问题，虽然由 JQuery 等库简化 DOM 操作，但是随着项目的复杂， DOM 操作复杂提升。开发者既要考虑处理数据还要考虑操作 DOM

- 为了简化 DOM 的复杂操作，于是就出现了各种 MVVM 框架，MVVM框架解决了视图和状态的同步问题。

- 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了。

- Virtual DOM 的好处是当状态改变时不需要立即更新 DOM ，只需要创建一个虚拟树来描述 DOM ，Virtual DOM 内部将弄清楚如何有效（diff）的更新 DOM。

- 参考 github 上 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 的描述

    - 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
    - 通过比较前后两次状态的差异更新真实 DOM

Manual DOM manipulation is messy and keeping track of the previous DOM state is hard. A solution to this problem is to write your code as if you were recreating the entire DOM whenever state changes. Of course, if you actually recreated the entire DOM every time your application state changed, your app would be very slow and your input fields would lose focus.

virtual-dom is a collection of modules designed to provide a declarative way of representing the DOM for your app. So instead of updating the DOM when your application state changes, you simply create a virtual tree or VTree, which looks like the DOM state that you want. virtual-dom will then figure out how to make the DOM look like this efficiently without recreating all of the DOM nodes.

virtual-dom allows you to update a view whenever state changes by creating a full VTree of the view and then patching the DOM efficiently to look exactly as you described it. This results in keeping manual DOM manipulation and previous state tracking out of your application code, promoting clean and maintainable rendering logic for web applications.


手动DOM操作比较麻烦，并且很难跟踪以前的DOM状态。解决此问题的方法是编写代码，就像在状态变化时重新创建整个DOM一样。当然，如果您每次更改应用程序状态时实际上都重新创建了整个DOM，则您的应用程序将非常缓慢，并且输入字段将失去焦点。

virtual-dom是模块的集合，旨在提供声明性的方式来表示应用程序的DOM。因此，无需在应用程序状态更改时更新DOM，只需创建一个虚拟树或VTree，它看起来像您想要的DOM状态。然后，virtual-dom将弄清楚如何有效地使DOM看起来像这样，而无需重新创建所有DOM节点。

virtual-dom允许您在状态更改时更新视图，方法是创建视图的完整VTree，然后有效地修补DOM以使其完全符合您的描述。这样可以避免在应用程序代码中进行手动DOM操作和先前状态跟踪，从而为Web应用程序提供了清晰且可维护的呈现逻辑。

## Virtual DOM 的作用

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 除了渲染 DOM 以外，还可以实现 SSR (Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app)等

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200710193554684.png)

服务端渲染其实就是将虚拟 DOM 转换成普通的字符串。

## Virtual DOM 库

- Snabbdom

    - Vue2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom
    - 大约 200 SLOC (single line of code)
    - 通过模块可扩展
    - 源码使用 TypeScript 开发
    - 最快的 Virtual 之一

- [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
