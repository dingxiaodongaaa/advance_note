# Stream

Nodejs 诞生之初就是为了提高 IO 性能，文件操作系统和网络模块都实现了流接口，Nodejs 中的流就是处理流式数据的抽象接口。

流处理数据的优势：

- 时间效率：流的分段处理可以同时操作多个数据 chunk
- 空间效率：同一时间流无需占据大内存空间
- 使用方便：流配合管理，扩展程序变得简单

Nodejs 中流的分类：

- Readable：可读流，能够实现数据的读取
- Writeable：可写流，能够实现数据的写操作
- Duplex：双工流，既可读又可写
- Tranform：转换流，可读可写，还能实现数据转换

上述的四种类型是 Stream 实现的四个具体的抽象，可以理解为是四个类，如果我们想要实现自己的可读流或者可写流操作，就需要去继承相应的类型，然后再去重写他们内部所提供的必须完成的方法，但是这种操作是不常见的因为 IO 操作常见的 fs http 模块本身就已经实现了流操作的接口，所以在使用的时候可以调用具体的模块所具有的事件或者 API 来达到生产或消费数据的操作。

所有流都继承自 EventEmitter 类，然后就可以基于发布订阅的模式，让它们具备可以发布数据的读写事件，在之后就是由事件循环来监控监听器的执行时机从而完成数据的处理。

## 可读流

可读流用于生产供程序消费数据的流，Nodejs 中常见的就是读取磁盘中的文件或者读取网络请求中的内容。

```js
const fs = require('fs')

const rs = fs.createReadStream('test.txt')

rs.pipe(process.stdout)
```

`fs.createReadStream()` 就相当于是创建了一个可读流。

之所以可以这样操作就是因为 fs 模块本身已经实现了 readable 的接口，同时还继承了 EventEmitter 类，当前生产数据的方式就是读取指定路径上的磁盘内容，这样就得到了一个数据源（可读流），然后通过 `pipe()` 管道操作把当前获取到的数据传递给 `process.stdout` ，在 Nodejs 中的 stdout 标准输出本身就是一个可写流。

### 自定义可读流

1. 集成 stream 中的 Readable 类
2. 重写 _read 方法调用 push 产出数据

```js
const { Readable } = require('stream')
// 定义数据存放数据，模拟底层数据
let source = ['lg', 'zce', 'syy']
// 自定义类集成 Readable
class MyReadable extends Readable {
  constructor(source) {
    super()
    this.source = source
  }
  _read () {
    let data = this.source.shift() || null
    this.push(data)
  }
}
// 消费数据
let myReadable = new MyReadable(source)

myReadable.on('readable', () => {
  let data = null
  while((data = myReadable.read()) !== null) {
    console.log(data.toString())
  }
})
myReadable.on('data', data => {
  console.log(data.toString())
})

```

核心的操作就是创建一个 `source` 数组，用它模拟底层的数据，之后再去定义一个 `MyReadable` 继承自 `Readable`，在自定义的构造函数里面需要重写 `_read` 方法，然后在这个方法里面调用 `push` 完成数据的添加， `push` 的时候会将数据添加到一个缓存中，等待消费者去读取数据，这个时候就会出现两个问题：
  - 底层数据（source）读取完成之后应该如何处理？
  - 消费者如何获取可读流中的数据？

解决第一个问题的方法是当数据读取完毕的时候调用 `push` 方法传递一个 `null`

第二个问题就是通过 `Readable` 提供的两个事件，分别是 `readable` 和 `data` 事件

`readable` 和 `data` 两个事件都可以用来消费数据，这两种方式是为了满足不同的消费数据的场景。有些时候只需要按需的读取一定量的数据，有些时候需要源源不断的将底层数据读出，基于这样的需求，在 `readable` 内部的实现上就存在了两种模式，一种是流动模式一种是暂停模式，对于使用者来说，两者的区别就在于消费数据的时候是否需要主动的调用 read 方法来读取数据。

#### 消费数据
- readable事件：当流中存在可读取数据时触发
- data 事件：当流中数据块传给消费者后触发

#### 可读流总结
- 明确数据生产与消费流程
- 利用 API 实现自定义的可读流
- 明确数据消费的事件使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210527095536843.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

## 可写流

### 自定义可写流

- 继承 stream 模块的 Writeable
- 重写 _write 方法，调用 write 执行写入

```js
const { Writable } = require('stream')

class MyWriteable extends Writable {
  constructor () {
    super()
  }
  _write (chunk, en, done) {
    process.stdout.write(chunk.toString() + '<----')
    process.nextTick(done)
  }
}

myWriteable = new MyWriteable()

myWriteable._write('hello nodejs', 'utf-8', () => {
  console.log('end')
})
```

### 常见的可写流事件

- pipe事件：可读流调用 pipe() 方法时触发
- unpipe事件：可读流调用 unpipe() 方法时触发

## 双工和转换流

Nodejs 中的 stream 是流操作的抽象接口集合，可读、可写、双工、转换是这四种不同类型流操作抽象的具体实现。

流操作的核心功能就是处理数据，nodejs 诞生的初衷就是解决 IO 密集型事务。不管是文件 IO 还是网络 IO 他们本质上都是数据的传输操作，再 Nodejs 内部准备了相应的模块来处理这两种 IO 操作，而这两个模块都继承了流和 EventEmitter 这两个类。所以在项目的实际使用场景中多数情况是直接使用封装好的处理流操作的模块，而不是自定义某种流进行处理。研究各种流操作的使用仅仅是为了更深一步的了解其使用方法。stream、四种类型流（readable、writeable、duplex、transform）、实现六操作的模块（net、fs、http）

### Duplex 是双工流，既能生产又能消费

Duplex 是一个同时实现了 readable 和 writeable 两种类型的流，在管道操作中它既可以作为上游生产数据，也可以作为下游消费数据。

### 自定义双工流

- 继承 Duplex 类
- 重写 _read 方法，调用 push 生产数据
- 重写 _write 方法，调用 write 消费数据

```js
const { Duplex } = require('stream')

class MyDuplex extends Duplex {
  constructor (source) {
    super()
    this.source = source
  }
  _read () {
    const data = this.source.shift() || null
    this.push(data)
  }
  _write (chunk, en, next) {
    process.stdout.write(chunk)
    process.nextTick(next)
  }
}

let source = ['a', 'b', 'c']
let myDuplex = new MyDuplex(source)

myDuplex.on('data', chunk => {
  console.log(chunk.toString())
})

myDuplex.write('hello readable', () => {
  console.log()
})
```

### Transform 实际上也是一个双工流

Duplex 中的读和写是相互独立的，它的读操作所创建的数据是不能被写操作当作数据源去直接使用的，但是在 transform 中是可以的。在转换流的底层对读写操作进行了连通。除此之外，转换流还可以对数据进行转换操作。

### 自定义转换流

- 继承 Transform 类
- 重写 _transform 方法，调用 push 和 callback
- 重写 _flush 方法，处理剩余数据

```js
const { Transform } = require('stream')

class MyTransform extends Transform {
  constructor () {
    super()
  }
  _transform (chunk, en, cb) {
    this.push(chunk.toString().toUpperCase())
    cb(null)
  }
}

const t = new MyTransform()

t.write('a')

t.on('data', chunk => {
  console.log(chunk.toString())
})
```

