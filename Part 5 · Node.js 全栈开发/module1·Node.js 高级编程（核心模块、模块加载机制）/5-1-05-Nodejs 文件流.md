# 文件流

## 文件可读流

文件可读流就是继承了 Readable 和 EventEmitter 类的内置 API，可以通过 fs 创建使用。

了解如何使用 fs 模块创建和消费数据，以及常见事件的使用。

### 创建一个可读流

```js
const fs = require('fs')

const rs = fs.createReadStream('data111.txt', {
  flags: 'r',
  encoding: null,
  fd: null,
  mode: 438,
  autoClose: true,
  start: 0,
  // end: 3,
  highWaterMark: 4
})

```

### 监听 data 事件，读取数据

```js

rs.on('data', chunk => {
  console.log(chunk.toString())
  rs.pause()
  setTimeout(() => {
    rs.resume()
  }, 1000)
})
```

### 监听 readable 事件，读取数据

```js
rs.on('readable', () => {
  let data
  while((data = rs.read(1)) !== null) {
    console.log(data.toString())
    console.log('----------', rs._readableState.length) // rs 内置的属性，获取缓存区内数据的长度
  }
})
```

### 可读流打开/关闭事件

```js
rs.on('open', fd => {
  console.log(fd, '文件被打开了')
})

rs.on('close', () => {
  console.log('文件被关闭了')
})
```

### 可读流 end 事件

```js
let bufferArr = []
rs.on('data', chunk => {
  bufferArr.push(chunk)
  console.log(chunk.toString())
})

// 由于 data 事件中获取到的数据仅仅是一个数据片段，它仅仅是一个 buffer 所以其中的数据往往是不连续的，所以经常会在 end 事件中，去对数据进行处理。
rs.on('end', () => {
  console.log(Buffer.concat(bufferArr).toString())
  console.log('结束了')
})
```

### 可读流 error 事件

```js
rs.on('error', err => {
  console.log('出错了')
})
```

## 文件可写流

文件可写流是继承了 Writeable 和 EventEmitter 类的内置 API

### 创建一个可写流

```js
const fs = require('fs')

const ws = fs.createWriteStream('data222.txt', {
  flags: 'w',
  mode: 438,
  encoding: 'utf-8',
  fd: null,
  autoClose: true,
  start: 0,
  highWaterMark: 2
})

```

### 可写流写入数据

```js
// 字符串或者 buffer
ws.write('hello nodejs', () => {
  console.log('数据写完了')
})

let buf = Buffer.from('hahaha')
ws.write(buf, () => {
  console.log('数据2写完了')
})
```

### 可写流 open 事件

```js
ws.on('open', fd => {
  console.log('open', fd)
})
```

### 可写流 close 事件

```js
close 是在数据写入操作全部完成之后再执行
ws.on('close', () => {
  console.log('close')
})
```

### 可写流 end 操作

```js
// end 执行之后就意味着数据写入操作完成
ws.end('最后要写入的数据')
```

### 可写流 error 事件

```js
// error
ws.on('error', err => {
  console.log('出错了')
})
```

## 可写流的执行流程

```js
const fs = require('fs')

const ws = fs.createWriteStream('test.txt', {
  highWaterMark: 3
})

let flag = ws.write('1')
console.log(flag) // true

flag = ws.write('2')
console.log(flag) // true

flag = ws.write('3')
console.log(flag) // false
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210601083047131.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

1. 第一次调用 write 方法时是将数据直接写入文件中
2. 第二次开始 write 方法就是将数据写入到缓存中
3. 生产速度和消费速度是不一样的，一般情况下生产速度会比消费速度快很多
4. 当 flag 为 false 之后并不意味着当前次的数据不能被写入了，但是我们应该告知数据的生产者，当前的消费速度已经跟不上生产速度了，所以这个时候，一般我们会将可读流了的模块修改为暂停模式
5. 当数据生产者暂定之后，消费者会慢慢的消化它内部缓存中的数据，知道可以再次被执行写入操作
6. 当缓冲区可以继续写入数据时如让生产者知道？ drain 事件

## drain 与写入速度

```js
const fs = require('fs')

const ws = fs.createWriteStream('test.txt', {
  highWaterMark: 3
})

let source = '字节跳动'.split('')
let num = 0
let flag = true

function executeWrite () {
  while(num !== 4 && flag) {
    flag = ws.write(source[num])
    num++
  }
}

executeWrite()

ws.on('drain', () => {
  console.log('drain执行了')
  executeWrite()
})
```

使用 drain 事件对写入流进行限速，一旦缓存达到 highWaterMark 之后就停止生产数据，知道 drain 事件触发的时候继续生产数据执行写入操作。

## 背压机制

### 数据读写可能存在的问题

```js
const rs = fs.createReadStream('test.txt')
const ws = fs.createWriteStream('test1.txt')

rs.on('data', chunk => {
  ws.write(chunk)
})
```

如上述代码，创建一个可读流一个可写流，将可读流中的数据通过可写流写入到 test1 中。

需要考虑的是，数据从磁盘中读取的速度是远远大于写入的速度的，也就是说生产数据的速度往往会比消费数据的速度大很多。在 Writeable 内部有维护一个队列，当它不能消费上游传过来的数据的时候，就会将上游传过来的不能消化的数据缓存到队列中，但是这个缓存的队列也是有大小限制的，所以这就会造成内存溢出、GC频繁调用、其他进程变慢的问题，这个时候就需要背压机制来让数据的生产者与消费者之间的数据平滑流动的机制。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210601092816417.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210601093031485.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

```js
const rs = fs.createReadStream('test.txt', {
  highWaterMark: 4
})
const ws = fs.createWriteStream('test1.txt', {
  highWaterMark: 1
})

rs.on('data', chunk => {
  let flag = ws.write(chunk, () => {
    console.log('写完啦')
  })
  if (!flag) rs.pause()
})

rs.on('drain', () => {
  rs.resume()
})
```

当可写流缓存达到上限之后，将可读流改为暂停模式，在可写流的 drain 事件中调用可读流的 resume 继续读取数据。