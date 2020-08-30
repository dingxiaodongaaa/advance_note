### 1、已知如下对象，请基于es6的proxy方法设计一个属性拦截读取操作的例子，要求实现去访问目标对象example中不存在的属性时，抛出错误：Property “$(property)” does not exist    （2018 今日头条）

```js
// 代码案例
const man = {
  name: 'jscoder',
  age: 22
}
// 补全代码
const proxy = new Proxy(...)
proxy.name // 'jscoder'
proxy.age // 22
proxy.location // property "$(property)" does not exist
```

答案

```js
const proxy = new Proxy(man, {
  get (target, property) {
    if (target.hasOwnProperty(property)) {
      return Reflect.get(target, property)
    } else {
      throw `Property "$(${property})" does not exist`
    }
  }
})
```

### 2、红灯三秒亮一次, 绿灯一秒亮一次, 黄灯2秒亮一次实现一个函数，如何让三个灯不断交替重复亮灯? (用Promise实现) 三个亮灯函数已经存在:

```js
function red(){
  console.log('red');
}
function green(){
  console.log('green');
}
function yellow(){
  console.log('yellow');
}
```

答案

```js
function timeout (ms, cb) {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb()
      resolve()
    }, ms)
  })
}

const loop = () => {
  Promise.resolve().then(() => {
    return timeout(3000, red)
  }).then(() => {
    return timeout(1000, green)
  }).then(() => {
    return timeout(2000, yellow)
  }).then(() => {
    loop()
  })
}

loop()
```

### 3、按顺序写出控制台打印结果（2020 碧桂园）

```js
var User = {
  count: 1,
  action: {
    getCount: function () {
      return this.count
    }
  }
}
var getCount = User.action.getCount;
setTimeout(() => {
  console.log("result 1", User.action.getCount())
})
console.log("result 2", getCount())
```

答案

```js
result 1 undefined
result 2 undefined
```

### 4、简答（字节跳动 二面）

- 你觉得typescript和javascript有什么区别
- typescript你都用过哪些类型
- typescript中type和interface的区别

1. TypeScript 是 JavaScript 的超集，ts 解决了 js 自有类型系统的不足，ts 需要编译成 js 运行。
2. 数组类型、函数类型、对象类型、字面量类型、联合类型（我都没用过）
3. - interface 不能创建基本数据类型的数据
   - 同名的 interface 可以合并
   - interface 继承使用 extends ， type 继承使用 &

### 5、对 async/await 的理解，分析内部原理

async/await 是 JavaScript 语法层面上实现的异步编程标准，实现了异步变成的扁平化解决了异步编程回调地狱的问题，是 JS 的异步编程在代码风格上看起来和普通的同步代码相同，更直观和简洁。

async/await 是 Generator 的语法糖，将 * 换成了 async ，yield 换成了 await ，并在内部实现了 Generator 的执行器。

### 6、async/await 如果右边方法执行出错该怎么办？（百度一面 2020）

try catch 捕获

### 7、说一下 event loop 的过程？promise 定义时传入的函数什么时候执行？（小米 三面）

event loop 的过程：

1. 在 tasks 队列中选择最老的 task ，如果没有可选的任务，则跳第六步执行
2. 将上面选择的 task 设置为正在运行的 task
3. 运行被选择的 task
4. 将 event loop 的 current running task 变为 null
5. 从 tasks 队列中移除前面运行的 task
6. 执行 microTasks 队列中的任务
7. 更新渲染

promise 定义时传入的函数会作为宏任务立即执行，他的 then 中传入的函数会作为微任务放入 microTasks 队列中等待宏任务执行结束之后执行。

### 8、说一下防抖函数的应用场景，并简单说下实现方式 （滴滴）

input 表单输入 input 事件获取输入内容并调用接口提交数据，每次内容更改都会频繁的触发事件并发送请求，造成资源浪费。此时可以使用防抖函数。

防抖可以通过事件延时处理的方式，如果触发事件重新计时，这样就只会在最后输入完成的时候才会去进行事件处理进行发送ajax请求等操作。

### 9、说一下V8的垃圾回收机制 （小米）

V8 引擎中采用分代回收的思想，将内存分为新生代和老生代，针对不同对象采用不同的 GC 算法。

对于新生代对象（存活时间较短的对象）采用复制算法和标记整理算法完成垃圾回收。首先新生代内存是二等分的，使用空间是 From ，空闲空间是 To。活动对象存储在 From 空间中，当触发垃圾回收机制的时候，首先会采用标记整理算法将 From 空间中的活动对象进行标记整理并将活动对象通过复制算法拷贝到 To 空间，然后将 From 空间和 To 空间交换并释放交换后变成 To 的空间。

从 From 拷贝到 To 的过程中可能会出现新生代晋升。触发晋升的原因有两种，一种是一轮 GC 之后还存活的新生代需要晋升；另一种是 To 空间的使用率超过 25% 的时候会出现晋升。

对于老生代对象（存活时间较长的对象）主要是采用标记清除算法对老生代中的对象进行垃圾回收。当新生代对象往老生代对象空间进行移动的时候，如果出现了空间不足就会进行标记整理算法，整理碎片空以存储晋升对象。

进行垃圾回收会阻塞 JavaScript 的执行，在老生代对象的GC过程中还会采用标记增量算法将整个垃圾回收操作拆分成一段一段的，组合的完成整个的垃圾回收的工作。这样会大大减少阻塞 JavaScript 的时间，提高用户体验。

### 10、performance API 中什么指标可以衡量首屏时间
https://www.cnblogs.com/wang-z-z/p/9485887.html
https://www.cnblogs.com/caizhenbo/p/7993533.html

在 document.onload 的时候，首屏时间 = performance.now() - performance.timing.navigationStart 

### 11、在 EcmaScript 新特性中，暂时性死区有什么作用
https://blog.csdn.net/nicexibeidage/article/details/78144138



### 12、观察者模式和发布订阅模式的区别标题

观察者模式中发布者与订阅者是有耦合的，发布者需要明确知道它的订阅者，当要发布消息的时候发布者直接通知订阅者执行相应的操作。

发布订阅模式中发布者与订阅者完全解耦，发布者不需要知道它有没有订阅者或者它的订阅者有哪些，当要发布消息的时候，发布者会通知消息中心，消息中心接收到消息之后负责通知所有的订阅者执行相应的更新。

### 13、gulp自己写过任务吗？说一下它的构建流程（阿里 2018）

gulp 是基于流的自动化构建工具，他的整个构建流程都是在读取文件流以及写入文件流，并在读写的过程中利用插件对流进行相应的处理，完成整个构建流程。项目的具体构建流程如下:

- 首先是对不同的资源文件进行处理，比如 js 文件的 lint 、babel 转义、压缩混淆，scss 文件的 lint、编译、压缩，HTML 的模板编译、 image 文件的压缩以及字体文件和其他资源文件的处理。

- 然后需要使用 useref 对 html 中引入的文件路径进行动态的修改（以为打包之后的路径可能是错误的路径或者 node_modules 中的文件访问不到） ，在处理的过程中还可以对文件进行进一步的处理，比如 js 压缩，css压缩，html压缩等。

- 然后是开发服务器的初始化，并对有必要监听变化并实时更新的文件添加监听。

### 14、package-lock.json 有什么作用，如果项目中没有它会怎么样，举例说明

package.json文件只能锁定大版本，也就是版本号的第一位，并不能锁定后面的小版本，你每次npm install都是拉取的该大版本下的最新的版本，为了稳定性考虑几乎是不敢随意升级依赖包的。package-lock.json 是在 `npm install`时候生成一份文件，用来记录当前状态下实际安装的各个npm package的具体来源和版本号。

### 15、webpack 常用配置项有哪些，并说明用途  （跟谁学 2020）

- mode 构建采用的模式分为 production development none。
- devtool 控制是否生成以及如何生成source map。
- server 配置开发服务器的配置项。
- entry 入口文件的位置。
- output 打包出口位置。
- module 对模块进行处理，在 module 中配置 rules ,webpack 对不同的资源进行构建的过程中会根据 rules 中配置的规则，匹配不同的文件利用对应的 loader 进行处理。
- plugins 插件配置列表，webpack 的插件配置的位置。

### 16、阐述 webpack css-loader 的作用和原理？ （跟谁学）

webpack 默认只能解析 js 代码，要解析其他类型的文件需要使用 loader 。css-loader 的作用就是用来处理 css 模块的。在打包的过程中利用它将 css 代码转换成 js 字符串的形式并存到一个数组中。然后使用 style-loader 将生成好的css字符串代码数组添加到DOM。

### 17、webpack中loader和plugin的区别是什么（字节跳动 搜狐）

loader 的作用 webpack 处理各种各样的资源模块的基础，有了各种资源文件的 loader ， webpack才能实现对项目中各种资源文件加载和打包处理。

pligin 主要是用于处理除了资源加载之外的其他的一些自动化相关的工作。例如，自动清除 dist 文件；自动拷贝不需要打包的资源文件到输出目录；压缩打包结果输出的代码等。

### 18、webpack、rollup、parcel 它们的优劣？

https://x-team.com/blog/rollup-webpack-parcel-comparison/

- webpack 优点：
  - 生态完善，扩展丰富
- webpack 缺点：
  - 配置相对繁琐

- rollup 优点：
  - 输出结果非常扁平执行效率比较高；
  - 会自动进行 tree shaking 移除未引用的代码；
  - 打包的结果完全可读。
- rollup 缺点：
  - 加载非 ESM 的第三方模块比较复杂，需要配置插件。
  - 模块最终打包到一个函数中，无法实现 HMR （模块热替换）
  - 在浏览器环境中，代码拆分依赖 AMD 库
所以在开发一个需要使用大量第三方库的应用程序，rollup 就不适合，如果是开发一个框架或者类库不需要依赖第三方模块，比较适合 rollup。

- parcel 优点：
  - 零配置
  - 多进程打包速度更快

### 19、babel.config.js 和 .babelrc 有什么区别？

baberc 的加载规则是按目录加载的，是只针对自己的代码。config的配置针对了第三方的组件和自己的代码内容。babel.config.js 是一个项目级别的配置，一般有了babel.config.js 就不会在去执行.babelrc的设置。

### 20、webpack 中 tree shaking 的用途和原理是什么？

tree-shaking 可以将未使用的模块摇掉，达到删除无用代码的目的。网页应用的 javascript 绝大部分都是通过网络加载执行的，所以加载的文件越小，整体执行的事件就越短， tree-shaking 就是为了删除无用代码，减小 js 体积，提高性能的。

原理：webpack 中的 tree-shaking 就是通过 import 解析模块的依赖关系，然后从字面量上对代码进行静态分析，分析的过程中对未使用的代码作标记，在 uglify 的时候将不会执行的代码删除掉。

### 21、阐述一下 eventbus 的原理，讲述eventbus在vue中的实践（猿辅导）

eventbus 是基于发布订阅模式实现的事件定义和触发机制。整个过程有三个角色分别是发布者，订阅者和消息中心，消息中心中维护了所有的发布者和订阅者的对应关系，当事件触发的时候，发布者会通知消息中心“事件触发了”，然后消息中心会通知所有的与这个发布者对应的订阅者执行更新。

vue 中可以利用的 eventbus 进行组件通信，首先需要创建一个 Vue 实例作为 eventbus 即事件中心，在 A 组件中（订阅者）通过 eventbus.$on 订阅消息，在 B 组件中（发布者）通过 eventbus.$emit 发布通知，之后 eventbus 会通知所有的订阅者执行响应的事件处理函数。

### 22、vue-loader 的实现原理是什么
https://nicholaslee119.github.io/2017/11/24/vueLoader%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90/
https://nicholaslee119.github.io/2017/12/01/vueLoader%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E7%B3%BB%E5%88%97%E4%B9%8Bselector/

vue-loader 是 vue 单文件组件的加载器，它的作用是将 vue 单文件组件中的 html js css 抽离出来，然后交给不同的 laoder 进行处理。

- 在 vue-loader 中调用 selctor 这个模块对文件中的不同代码进行抽离。
- 在 selector 中调用了 parser 这个方法将 .vue 解析成对象 parts 对象，对象里面分别有 style, script, template。
  - parser 完成分析分解 .vue 调用的是 parseComponent 方法并在 parseComponent 中调用了 parseHTML 
  - parseHTML 中通过一个 while 循环分别对 template 和 script style 进行拆分。
- 拆分完之后将 JavaScript 交给 babel-loader 处理，最后生成可执行的 js
- 将 template 交给 template-compiler 处理，最后生成可用的 HTML
- 将 style 交给 style-compiler 生成可用的 css ，然后交给 css-loader vue-style-loader 处理。