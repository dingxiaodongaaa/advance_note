# Nodejs 概述

## Nodejs 可以做什么？

- 轻量级、高性能的 Web 服务
- 前后端 JavaScript 同构开发
- 便捷高效的前端工程化

## Nodejs 架构

![Nodejs 架构](https://img-blog.csdnimg.cn/20210515165256521.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

### Natives modules

- 当前层内容由 JS 实现
- 提供应用程序可直接调用库，例如 fs、path、http 等
- JS 语言无法直接操作底层硬件设置

### Builtin modules “胶水层”

JS 语言是无法直接操作底层硬件设备的，Nodejs 核心模块想跟硬件通信需要有一个桥梁，Builtin modules 就是这个桥梁。通过这个桥梁与硬件通信，实现比如文件的读写行为，这一层主要是由 c++ 代码完成的。Builtin modules 会帮助我们调用具体的 c++ 函数。

### V8 等具体的模块

- V8：执行 JS 代码，提供桥梁接口（js代码的执行环境以及js的最终执行）
- Libuv：事件循环、事件队列、异步IO
- 第三方模块：zlib、http、c-ares等

Nodejs 组成：
![Nodejs 组成](https://img-blog.csdnimg.cn/20210515170830641.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

Nodejs 是基于 Reactor 模式实现单线程异步非阻塞IO、事件驱动

Nodejs 更适用于 IO 密集型高并发请求

## Nodejs 异步 IO

阻塞 IO 和非阻塞 IO 的区别，是否能立即获取到调用之后的返回结果。

通过轮询，重复调用 IO 操作，判断 IO 是否结束

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021051519213566.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

- IO 是应用程序的瓶颈所在
- 异步 IO 提高性能无需原地等待结果返回
- IO 操作属于操作系统级别，平台都有对应实现
- Nodejs 单线程配合事件驱动架构及 libuv 实现了异步 IO

## 事件驱动架构

事件驱动架构是软件开发中的通用模式。主体发布消息，其他实例接收消息并执行相应的处理程序。

```js
const EventEmitter = require('events')

const myEvent = new EventEmitter()

myEvent.on('事件1', () => {
  console.log('事件1执行了')
})

myEvent.on('事件1', () => {
  console.log('事件1-2执行了')
})

myEvent.emit('事件1')
```

## Nodejs 单线程

Nodejs 可以使用 JS 实现高效可伸缩的高性能 Web 服务，常见的 Web 服务都是由多线程或者多进程实现的，单线程是如何实现高并发？Nodejs 单线程存在什么样的确定？

异步非阻塞 IO 配合事件回调通知实现高并发。

Nodejs 单线程指的是，Nodejs 主线程是单线程的。并不是说 Nodejs 只有一个线程。

Nodejs 平台下的 JS 代码最终是在 V8 中执行的，而在 V8 中只有一个主线程来执行 JS 代码，这就是我们平时所说的单线程。

在 libvu 库中是存在一个线程池的，如下如右侧，在线程池中默认情况下会有四个线程。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210515194330467.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

如果将 Nodejs 异步请求分为，网络 IO 和非网络 IO 以及非 IO 三种。

针对于网络 IO 操作，libvu 库会去调用相对应的 IO 接口去进行处理。而另外的两种异步操作就会使用线程池中的线程进行处理。线程的数量可以通过配置的方式进行增加（一般不需要这样做）。

### 单线程在处理 CPU 密集型代码中的问题

假如程序中存在大量的计算，程序的执行需要长时间的占用主线程，就会导致整个程序的执行受到阻塞。

```js
const http = require('http')

// 模拟存在大量计算的 cpu 密集型任务
function sleepTime (time) {
  const sleep = Date.now() + 1000 * time
  while(Date.now() < sleep) {}
  return
}
sleepTime(4)

const server = http.createServer((req, res) => {
  res.end('server starting')
})

server.listen(3000, () => {
  console.log('服务启动了')
})
```

## Nodejs 应用场景

### Nodejs 作为中间层

非阻塞的异步 IO 让 Nodejs 非常适合处理 IO 密集型高并发请求。所以很多时候，企业会选择在前端和大后端之间利用 Nodejs 来搭建一个 BFF 层来提高挣个项目的吞吐量，并且还让我们非常方便的处理数据。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210515200713841.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

### 操作数据库提供 API 服务

如果不关注大量的业务逻辑的前提下，我们也可以使用 NodeJS 来操作数据库搭建高效轻量的 API 服务。

### 实时聊天程序

## Nodejs 全局对象

- 与浏览器平台的 window 不完全相同
- Nodejs 全局对象上挂载许多属性

全局对象是 JavaScript 中的特殊对象 `global` ,`global` 的根本作用就是作为全局变量的宿主（类似于浏览器中的 window）

### Nodejs 常见的全局变量

- __filename：返回正在执行脚本文件的绝对路径
- __dirname：返回正在执行脚本所在目录
- timer 类函数：执行顺序与事件循环间的关系
- process：提供与当前进程互动的接口
- require：实现模块的加载
- module、exports：处理模块的导出

### Nodejs 全局对象 global 和 this

默认情况下 this 是空对象，和 global 并不是一样的

```js
console.log(this === global) // false

(function () {
  console.log(this === global) // true
})()
```

### process

当前 Nodejs 进程的信息并进行控制。

#### 1. 资源： cpu 内存

```js
console.log(process.memoryUsage()) // 内存使用情况
console.log(process.cpuUsage()) // cpu 占用事件

// {
//   rss: 18366464,
//   heapTotal: 4247552,
//   heapUsed: 2167408,
//   external: 704144
// }
```

- `heapTotal` 和 `heapUsed` 代表 V8 的内存使用情况。
- `external` 代表 V8 管理的绑定到 Javascript 对象的 C++ 对象的内存使用情况。
- `rss，常驻集大小`, 是为进程分配的物理内存（总分配内存的子集）的大小，包括所有的 C++ 和 JavaScript 对象与代码。
- `arrayBuffers` 代表分配给 `ArrayBuffer` 和 `SharedArrayBuffer` 的内存，包括所有的 Node.js Buffer。 这也包含在 `external` 值中。 当 Node.js 被用作嵌入式库时，此值可能为 0，因为在这种情况下可能无法跟踪 `ArrayBuffer` 的分配。

#### 2. 运行环境：运行目录，node环境，cpu架构，用户环境，系统平台

```js
console.log(process.cwd()) // current work diractory 简写
console.log(process.versions) // node 版本
console.log(process.arch) // 架构
console.log(process.env) // 环境
console.log(process.env.PATH) // 环境变量
console.log(process.env.USERPROFILE) // 管理员目录 mac 中用 HOME
console.log(process.platform) // 操作系统
```

#### 3. 运行状态：启动参数，PID，运行时间

```js
console.log(process.argv)
console.log(process.argv0)
console.log(process.pid)

console.log(process.uptime()) // 文件从运行开始到结束的运行时间
```

#### 4. 事件

```js
process.on('exit', (code) => {
  // 回调中只能执行同步代码，不支持异步代码
  console.log('exit', code)
}) // 当前脚本程序退出事件
process.on('beforeExit', (code) => {
  console.log('before exit', code)
})
console.log('最后一句代码')
process.exit() // 手动退出脚本，不会触发 beforeExit 事件
```

#### 5. 标准输出 输入 错误

```js
console.log = function (data) {
  process.stdout.write('-----' + data + '\n')
}
console.log(11)
console.log(22)
```

```js
const fs = require('fs')

fs.createReadStream('test.txt')
  .pipe(process.stdout)
```

```js
process.stdin.pipe(process.stdout)
```

```js
process.stdin.setEncoding('utf-8')
process.stdin.on('readable', () => {
  let chunk = process.stdin.read()
  if (chunk !== null) {
    process.stdout.write('data' + chunk)
  }
})
```