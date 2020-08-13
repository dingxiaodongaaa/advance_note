# 丁晓东 ｜ Part 3 | 模块二

## 简答题

### 请简述 Vue 首次渲染的过程。

- Vue 初始化完成之后，通过 new Vue() 创建实例的时候，在 Vue 的构造函数中会调用 this._init() 这个方法初始化实例，在 this._init() 这个方法中最终会调用 vm.$mount() 这个方法完成 DOM 的首次渲染。分析 Vue 首次渲染的过程就是分析 vm.$mount() 的执行过程。

1. 执行 entry-runtime-with-compiler.js 中给 $mount() 添加的部分

- 获取模板
  - 首先会判断 options 中是否有 render() 函数。
  - 如果没有 render() 函数，获取 options.template，如果是一个元素节点，直接返回 innerHTML 作为模板。
  - 如果是一个字符串，判断字符串是否以 “#” 开头，如果是，作为 id 选择器获取对应元素的 innerHTML 作为模板。
  - 如果 options 中没有设置模板，判断是否有 el 如果有，获取 el 的 outerHTML 作为模板。
- 编译模板
  - 调用 compileToFunction() 函数，把获取到的模板转换成 render() 函数。

2. 执行 runtime/index.js 中初始化定义的 $mount()

- mountComponent(this, el)
  - mountComponent() 中首先判断 options 中是否有 render() 函数，如果没有 render() 发出警告。
  - 调用 callhook() 执行生命周期的 beforeMount 钩子函数
  - 然后声明 updateComponent() 函数
    - 在这个函数中会调用 update() 这个方法，
    - 在 update() 中调用 render() 函数生成 vnode 返回给 update()
    - 在 update() 中通过调用 vm.\__patch__() 渲染生成的 vnode ，更新到页面上。
    - 最后，调用 callhook() 执行生命周期的 mounted 钩子函数。
  - 然后创建 watcher 实例，并将这个定义好的 updateComponent 作为第二个参数传入。 
  - 在创建完 watcher 之后会通过调用 watcher.get() 执行 updateComponent() 这个方法,挂载真实 DOM。

### 请简述 Vue 响应式原理。

Vue 是通过数据劫持结合发布订阅模式实现的，在数据获取的时候收集依赖，在数据更改之后发送通知、更新视图，实现数据的响应式。

在 Vue 中，数据响应式原理的具体实现是通过递归调用 observe 方法，在 observe 中通过创建 observer 实例实现数据的响应式。

分析 Vue 的响应式原理就是分析 Observer 类的实现过程。 

在 Observer 中会对传入的选项是一个数组还是对象进行分类讨论，并分别对对象和数组进行响应式处理。

- 如果传入的是一个对象
  - 调用 this.walk() 方法，循环遍历对象的每一个属性，通过 defineReactive() 做响应式处理
  - 在 defineReactive() 中首先创建一个 dep 对象用于后续在 get() 中进行依赖的收集以及 set() 中发送通知。
  - 然后通过 Object.defineProperty() 将对象的属性转化成 getter/setter
  - 在 get() 中调用 dep.depend() 收集 watcher ，将 watcher 储存到 dep 的 subs 数组中，并返回对应值。
  - 在 set() 中设置新值，并调用 dep.notify() 遍历 subs 数组，调用所有的 watcher 的 update() 方法，派发更新。
    - 如果 set 的新数据是一个对象，对这个新对象进行响应式处理。

- 如果传入的是一个数组
  - 由于数组是通过数组的原型方法来改变内容的，所以数组中对数据的监听是通过重写数组原型的方法来实现的。
  - 通过对数组原型方法的重写，给每一个改变数组的原型方法做响应式处理。核心就是在拦截器（重新的原型方法）中调用了数组的 dep 对象的 dep.notify() 方法发送通知。
  - 为了不污染全局 Array.prototype ,在 Observer 中只针对那些需要响应式的数组中使用 \__proto__ 来覆盖原型方法。
  - 由于浏览器对 \__proto__ 属性的支持不同，分类讨论。
    - 如果支持，直接使用 \__proto__ 覆盖数组的原型方法。
    - 如果不支持，通过循环，将所有的拦截器直接设置到数组对象上，以此来拦截数组的原型方法。
  - 数组收集依赖的方式和对象是一样的，也是在 Object.defineProperty() 中的 。get 收集 watcher ，不同的是，由于数组发送通知的地方是在数组的拦截器中，所以收集的依赖是通过调用 dependArray() 将 watcher 存储在数组的 observer 的 dep 对象上。

### 请简述虚拟 DOM 中的 key 的作用和好处。

### 请简述 Vue 中模板编译的过程。
