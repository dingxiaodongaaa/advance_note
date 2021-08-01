# Nodejs 核心模块

## path

用来处理文件/目录的路径

常用 API :

- `basename()` 获取路径中基础名称
- `dirname()` 获取路径中目录名称
- `extname()` 获取路径中扩展名称
- `isAbsolute()` 获取路径是否为绝对路径
- `join()` 拼接多个路径片段
- `resolve()` 返回绝对路径
- `parse()` 解析路径
- `format()` 序列化路径
- `normalize()` 规范化路径

const path = require('path')

### 1. `basename()` 获取路径中的基础名称

01. 返回的就是接受路径当中的最后一部分
02. 第二个参数表示扩展名,如果说没有设置则返回带后缀的完整的文件名称
03. 第二个参数作为后缀时,如果没有在当前路径中被匹配到,那么就会忽略
04. 处理目录路径的时候,如果结尾有路径分隔符,会被忽略

```js
// D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api/node-path.js

console.log(path.basename(__filename)) // node-path.js
console.log(path.basename(__filename, '.js')) // node-path
console.log(path.basename(__filename, '.css')) // node-path.js
console.log(path.basename('/a/b/c')) // c
console.log(path.basename('/a/b/c/')) // c
```

### 2. `dirname()` 获取路径目录名

01. 返回路径中最后一部分的上一层目录所在路径

```js
//D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api/node-path.js

console.log(path.dirname(__filename)) // D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api
console.log(path.dirname('/a/b/c')) // /a/b
console.log(path.dirname('/a/b/c/')) // /a/b
```

### 3. `extname()` 获取路径的扩展名

01. 返回 path 路径中相应文件的后缀名
02. 如果 path 路径中存在多个点,他匹配的时最后一个点,到结尾的内容

```js
// D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api/node-path.js

console.log(path.extname(__filename)) // .js
console.log(path.extname('/a/b')) // 空
console.log(path.extname('/a/b.c.html.js.css')) // .css
console.log(path.extname('/a/b.c.html.js.')) // .
```

### 4. `parse()` 解析路径

01. 接受一个路径,返回一个对象
02. root dir base ext name
03. 当接受的路径是一个相对路径的时候 root 为空字符串

```js
// D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api/node-path.js

const obj = path.parse('/a/b/c/index.html')
console.log(obj) { root: '/', dir: '/a/b/c', base: 'index.html', ext: '.html', name: 'index' }

const obj = path.parse('/a/b/c/index.html/')
console.log(obj) // { root: '/', dir: '/a/b/c', base: 'index.html', ext: '.html', name: 'index' }

const obj = path.parse('./a/b/c')
console.log(obj) // { root: '', dir: './a/b', base: 'c', ext: '', name: 'c' }
```

### 5. `format()` 序列化路径

```js
const obj = path.parse('/a/b/c/')
console.log(path.format(obj))
```

### 6.`isAbsolute()`  判断当前路径是够否为绝对路径

```js
console.log(path.isAbsolute('foo')) // false
console.log(path.isAbsolute('/foo')) // true
console.log(path.isAbsolute('///foo')) // true
console.log(path.isAbsolute('')) // false
console.log(path.isAbsolute('.')) // false
console.log(path.isAbsolute('../bar')) // false
```

### 7. `join()` 拼接路径

```js
console.log(path.join('a/b', 'c', 'index.html')) // a\b\c\index.html
console.log(path.join('/a/b', 'c', 'index.html')) // \a\b\c\index.html
console.log(path.join('/a/b', 'c', '../', 'index.html')) // \a\b\index.html
console.log(path.join('/a/b', 'c', './', 'index.html')) // \a\b\c\index.html
console.log(path.join('/a/b', 'c', '', 'index.html')) // \a\b\c\index.html
console.log(path.join('')) // .
```

### 8. `normalize()` 规范化路径 

```js
console.log(path.normalize('')) // .
console.log(path.normalize('a/b/c/d')) // a\b\c\dc
console.log(path.normalize('a///b/c/../d')) // a\b\d
console.log(path.normalize('a///b\/c/../d')) // a\b\d
console.log(path.normalize('a/\b\/c/d')) // a\c\d \b被转义了
```

### 9. `resolve()` 绝对路径

1. resolve([from], to)

```js
// D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api/node-path.js

console.log(path.resolve()) // D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api
console.log(path.resolve('a', 'b')) // D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api\a\b
console.log(path.resolve('a', '/b')) // D:\b
console.log(path.resolve('/a', '/b')) // D:\b
console.log(path.resolve('/a', 'b')) // D:\a\b
console.log(path.resolve('/a', '../b')) // D:\b
// 正常人一般都这样用:
console.log(path.resolve('index.html')) // D:\workPlatform\lagoufed\lagou-demo-projects\5-1\node_ts_api\index.html
```

## Buffer

Buffer 通常称为 Buffer 缓冲区。Buffer 的存在让 js 可以在 Nodejs 中操作二进制数据。

Buffer 是什么？在哪？做什么？

二进制数据、流操作、Buffer

JavaScript 语言起初时服务于浏览器平台，所以在内部主要操作的数据类型就是字符串，但是 Nodejs 的出现让我们在服务端可以直接使用 JavaScript 进行编程，而不可避免的就会使用 JavaScript 语言进行 IO 操作，例如文件的读写、网络服务中数据的传输等，这个时候就会使用到 Buffer。

用户使用软件来获取信息，开发者使用语言来处理和展示信息，这个信息就是数据，字符、图片、音频、视频等等。不管看到的或者听到的是什么，对于计算机来说都是二进制数据，所以 IO 行为操作的就是二进制数据。

Stream 可以看成一种数据类型，是可以用来存储数据的，不过他是可以分段的，在大数据传输的时候就可以使用流操作，这样可以避免因为操作的数据内存过大导致内存被占满的问题。使用流操作配合管道技术实现数据分段传输。最典型的例子就是看视频，一般都是便下载数据边看的过程。

数据在生产者和消费者之间流通的过程中，肯定会因为生产速度大于消费速度或者，消费速度大于生产速度导致数据的等待，这些等待的数据往往就需要 Buffer 来存储。也就是我们说的缓冲区。 

Nodejs 中的 Buffer 是一片内存空间。

Nodejs 中的 JS 代码都是由 V8 引擎来执行的，照道理所有的内存消耗都来自于 V8 引擎的堆内存的消耗，但是 Buffer 是堆内存之外的一片空间，它是不会占据堆内存的大小的。Buffer 的内存空间的申请并不是由 Nodejs 来完成的，但是在使用层面上它的空间分配又是由我们编写的 JS 代码来控制的，因此在空间回收的时候还是由 V8 的 GC 来回收的。

### Buffer 总结

- Buffer 是无需 require 的一个全局变量
- 实现 Nodejs 平台下的二进制数据操作
- 不占据 V8 堆内存大小的内存空间，直接由 c++ 进行分配
- Buffer 内存的使用是由 Node 来控制，由 V8 的 GC 回收
- 一般配合 Stream 流使用，充当数据缓冲区。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210516151606815.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

### 创建 Buffer

Buffer 是 Nodejs 的内置类，我们使用的就是它的实例方法后者静态方法。

创建 Buffer 实例的方法：

- alloc：创建指定字节大小的 buffer
- allocUnsafe：创建指定大小的 bugger（不安全）
- from：接收数据，创建 buffer

Buffer 明明是一个类，为什么不使用 new 操作？

在 Nodejs v6 版本之前是可以直接通过 new 操作来实例一个 buffer 对象的，但是这种操作给到我们的对象实例的权限实在是太大了，所以后续在高版本的 Nodejs 中做了一些处理，所以还是不建议直接通过 new 来创建 buffer 的实例的。

#### Buffer.alloc 传入一个数字

```js
const b1 = Buffer.alloc(10)

console.log(b1) // <Buffer 00 00 00 00 00 00 00 00 00 00>
```

Buffer 是一个十六进制数据，上面打印的 Buffer 一共10个字节，每个 00 正好对应一个字节，也就是8位。

#### Buffer.allocUnsafe 传入一个数字

```js
const b2 = Buffer.allocUnsafe(10)

console.log(b2) // <Buffer 09 20 fb fc 01 01 00 00 09 25>
```

示例一中创建 buffer 中的数据都是 0 ，也就是没有数据的。但是在第二个示例中创建的 buffer 是有数据的。这就是 allocUnsafe 的特点，创建的空间是不够安全的。在 allocUnsafe 的时候，只要内存中有一片空闲的空间，他就会被拿过来用。由于 GC 算法并不能保证空间的内存都能实时的回收，比如有一些内存空间已经没有在使用了，但有一些内存碎片的存在，他们的数据还是存在的，只不过并没有对象指向它，也就是说没有被引用了，在具体使用的时候可能并不会影响我们的使用，因为我们要的只是一个内存的大小，但是这种操作终归是不安全的。

#### Buffer.from 传入一个字符串

```js
const b1 = Buffer.from('1')

console.log(b1) // <Buffer 31> 31 是 '1' 在 utf-8 中对应的编码。

const b2 = Buffer.from('中')

console.log(b2) // <Buffer e4 b8 ad> 在 utf-8 中一个汉字对应三个字节。
```

#### Buffer.from 传入一个数组

```js
const b1 = Buffer.from([1, 2, 3])
console.log(b1) // <Buffer 01 02 03>

const b2 = Buffer.from([1, 2, 3, '中'])
console.log(b2) // <Buffer 01 02 03 00>
console.log(b2.toString()) // 空

const b3 = Buffer.from([1, 2, 3, 0xe4, 0xb8, 0xad])
console.log(b3) // <Buffer 01 02 03 00>
console.log(b3.toString()) // 中
```

#### Buffer.from 传入一个 buffer

```js
const b1 = Buffer.alloc(3)
const b2 = Buffer.from(b1)

console.log(b1) // <Buffer 00 00 00>
console.log(b2) // <Buffer 00 00 00>
```

b2 使用 b1 创建来的，这两块内存空间在引用的时候存在什么样的关系呢？
也就是说，更改 b1 或者 b2 其中一个的时候会不会影响到另一个 buffer 呢？

```js
b1[0] = 1
console.log(b1) // <Buffer 01 00 00>
console.log(b2) // <Buffer 00 00 00>
```

所以通过 Buffer.from 创建的这块空间是全新的一块拷贝出来的空间，跟之前的空间是没有关系的。

### Buffer 实例方法

- fill：使用数据填充 buffer
- write：向 buffer 中写入数据
- toString：从 buffer 中提取数据
- slice：截取 buffer
- indexOf：在 buffer 中查找数据
- copy：拷贝 buffer 中的数据

let buf = Buffer.alloc(6)

#### fill

- 使用传入的第一个参数将 buffer 填满，如果第一个参数的长度不能填满 buffer 就重复直到填满；
- 如果第一个参数的长度大于 buffer 的长度，从前面截取填满 buffer
- 第二个参数和第三个参数为填入到 buffer 的起止位置，规则为顾头不顾尾

```js
buf.fill('123')
console.log(buf) // <Buffer 31 32 33 31 32 33>
console.log(buf.toString()) // 123123

buf.fill('123456789')
console.log(buf) // <Buffer 31 32 33 34 35 36>
console.log(buf.toString()) // 123456

buf.fill('123', 1)
console.log(buf) // <Buffer 00 31 32 33 31 32>
console.log(buf.toString()) // 12312

buf.fill('123', 1, 3)
console.log(buf) // <Buffer 00 31 32 00 00 00>
console.log(buf.toString()) // 12
```

#### write

- 第一个参数为写入到 buffer 中的数据
- 第二个参数为写入到 buffer 的起始位置
- 第三个参数为规定写入的数据的长度

```js
buf.write('123')
console.log(buf) // <Buffer 31 32 33 00 00 00>
console.log(buf.toString()) // 123

buf.write('123', 1)
console.log(buf) // <Buffer 00 31 32 33 00 00>
console.log(buf.toString()) // 123

buf.write('123', 1, 4)
console.log(buf) // <Buffer 00 31 32 00 00 00>
console.log(buf.toString()) // 123
```

#### toString

- 转义 buffer 中的数据
- 第一个参数为转义采用的编码格式
- 第二个参数为转义的起始位置
- 第三个参数为转义的结束位置，顾头不顾尾

```js
buf = Buffer.from('大前端')
console.log(buf) // <Buffer e5 a4 a7 e5 89 8d e7 ab af>
console.log(buf.toString('utf-8')) // 大前端
console.log(buf.toString('utf-8', 3, 6)) // 前
```

#### slice

- 截取 buffer
- 第一个参数为截取的起始位置
- 第二个参数为截取的结束位置，顾头不顾尾

```js
buf = Buffer.from('字节跳动')
let b1 = buf.slice()
console.log(b1)
console.log(b1.toString())

buf = Buffer.from('字节跳动')
let b1 = buf.slice(3, 9)
console.log(b1) // <Buffer e8 8a 82 e8 b7 b3>
console.log(b1.toString()) // 节跳

let b2 = buf.slice(-3) // 从后往前截取三个字节
console.log(b2) // <Buffer e5 8a a8>
console.log(b2.toString()) //动
```

#### indexOf

- 第一个参数为查找的内容
- 第二个参数为查找的起始位置
- 找到返回下标,找不到返回 -1

```js
buf = Buffer.from('dxd想去字节,想去阿里,想去滴滴,想去独角兽')
console.log(buf)
console.log(buf.indexOf('想')) // 3
console.log(buf.indexOf('想', 4)) // 16
console.log(buf.indexOf('想lili', 4)) // -1
```

#### toString

- 第一个参数为拷贝的容器
- 第二个参数为从数据源 buffer 中开始读数据的位置
- 第三个参数为从容器 buffer 中开始写的位置
- 第四个参数为在容器 buffer 中结束写的位置

```js
let b1 = Buffer.alloc(6)
let b2 = Buffer.from('前端')

b2.copy(b1, 3, 3, 6) // 将 b2 中的数据拷贝到 b1 里面
console.log(b1.toString()) // 端
console.log(b2.toString()) // 前端
```

### Buffer 静态方法

- concat：将多个 buffer 拼接成一个新的 buffer
- isBuffer：判断当前数据是否为 buffer

#### concat

- 第一个参数为一个 buffer 数组
- 第二个可选参数为返回结果 buffer 的长度

#### isBuffer

- 接收一个参数，判断该参数是否是一个 buffer

## FS

FS 是内置核心模块,提供文件系统操作 API。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210517234904744.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

### FS 基本类操作

可以实现文件信息的获取，例如判断是文件还是目录、文件的可读流和可写流操作、文件的监听行为。

### FS 常用 API

文件的打开和关闭，文件的增删改查。

### 文件的权限位、标识符、文件描述符

#### 权限位

- 权限位：在当前操作系统内不同的用户角色对于当前文件可以执行的不同权限操作。文件的权限操作分为三种 r （读）、 w （写）、  x（执行）。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210517235518699.png)

下图是 linux 或者 unix 中一个目录下的文件的权限列表.在 windows 中一般的权限都是可读可写不可执行

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210517235941440.png)

**八进制数 0o666 对应十进制数 438 对应二进制数 110110110，对应的权限就是可读可写不可执行**

#### 标识符

Nodejs 中 flag 表示对文件的操作方式

常见的操作符：

- r：表示可读
- w：表示可写
- s：表示同步
- +：表示执行相反操作
- x：表示排他操作
- a：表示追加操作

#### 文件描述符

- fd：就是操作系统分配给被打开文件的标识（文件标识符）

### 文件操作 API

#### 文件读写与拷贝操作

Nodejs 中对文件的操作都存在同步和异步两种方式。

- readFile：从指定文件中读取数据
- writeFile：向指定文件中写入数据
- appendFile：追加的方式向指定文件中写入数据
- copyFile：将某个文件中的数据拷贝至另一个文件
- watchFile：对指定文件进行监控

将 md 文件转换为 html 的一个小package https://github.com/dingxiaodongaaa/md_to_html

### 文件打开与关闭

前面学习的 readFile 和 writeFile 以及 copyFile 是将文件内容一次性的全部读到内存中然后一次性的写入到目标文件。这种对于大文件的操作显然是不可取的，甚至有可能造成内存溢出。

针对大文件的读写，我们需要一个能够边读边写的操作方式。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210520220911357.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

const fs = require('fs')
const path = require('path')

#### open & close

```js
// open
fs.open(path.resolve('data.txt'), 'r', (err, fd) => {
  console.log(fd)
})

// close
fs.open(path.resolve('data.txt'), 'r', (err, fd) => {
  console.log(fd)
  fs.close(fd, err => {
    console.log('关闭成功')
  })
})
```

#### read & write

- read: 所谓的读操作就是将数据从磁盘文件中写入到 buffer 中
- write: 将缓存区中的内容写入到磁盘文件中

```js
let buf = Buffer.alloc(10)

/**
 * 第一个参数读取文件的文件标识符
 * 第二个参数是目标 buffer
 * 第三个参数是指从哪个位置开始写入 buffer
 * 第四个参数是读取内容的字节长度
 * 第五个参数是指从哪个位置开始读取内容
 */
fs.open('data.txt', 'r', (err, rfd) => {
  console.log(rfd)
  fs.read(rfd, buf, 1, 3, 0, (err, readBytes, data) => {
    console.log(readBytes)
    console.log(data)
    console.log(data.toString())
  })
})

// write: 将缓存区中的内容写入到磁盘文件中
buf = Buffer.from('1234567890')
fs.open(path.resolve('target.txt'), 'w', (err, wfd) => {
  fs.write(wfd, buf, 0, 4, 0, (err, written, buffer) => {
    console.log(written)
    console.log(buffer)
    console.log(buffer.toString())
  })
})
```

#### 拷贝

```js
fs.open('data.txt', 'r', (err, rfd) => {
  fs.open('target.txt', 'w', (err, wfd) => {
    fs.read(rfd, buf, 0, 5, 0, (err, readBytes, data) => {
      fs.write(wfd, buf, 0, 5, 0, (err, written, buffer) => {
        console.log('拷贝成功了')
      })
    })
  })
})
```

#### 完全拷贝

```js
const BUFFER_SIZE = buf.length
let readOffset = 0

fs.open('data.txt', 'r', (err, rfd) => {
  fs.open('target.txt', 'a+', (err, wfd) => {
    function next () {
      fs.read(rfd, buf, 0, BUFFER_SIZE, readOffset, (err, readBytes) => {
        if (!readBytes) {
          fs.close(rfd, () => {})
          fs.close(wfd, () => {})
          console.log('拷贝成功了')
          return
        }
        readOffset += BUFFER_SIZE
        fs.write(wfd, buf, 0, readBytes, (err, written, buffer) => {
          next()
        })
      })
    }
    next()
  })
})
```

### 目录操作 API

- access：判断文件或目录是否具有操作权限
- stat：获取目录及文件信息
- mkdir：创建目录
- rmdir：删除目录
- readdir：读取目录中的内容
- unlink：删除指定文件

const fs = require('fs')

#### access

```js
fs.access('data.txt', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('有操作权限')
  }
})
```

#### stat

```js
fs.stat('data.txt', (err, statObj) => {
  console.log(err)
  console.log(statObj.isFile())
  console.log(statObj.isDirectory())
})
```

#### mkdir

在**已存在**的 a 目录下的**已存在**的 b 目录中创建 c 目录

```js
fs.mkdir('a/b/c', (err) => {
  if (!err) {
    console.log('创建成功')
  } else {
    console.log(err)
  }
})
```

递归参数为 true ， a、 b 两个目录如果不存在会自动创建

```js
fs.mkdir('a/b/c', {recursive: true}, (err) => {
  if (!err) {
    console.log('创建成功')
  } else {
    console.log(err)
  }
})
```

#### rmdir

在 a 目录下的的 b 目录中删除空的 c 目录

```js
fs.rmdir('a/b/c', (err) => {
  if (!err) {
    console.log('删除成功')
  } else {
    console.log(err)
  }
})
```

递归参数为 true ，将 a 目录以及其所有的子目录全部删除

```js
fs.rmdir('a', {recursive: true}, (err) => {
  if (!err) {
    console.log('删除成功')
  } else {
    console.log(err)
  }
})
```

#### readdir

读取 a 目录下的一级子目录和一级子文件

```js
fs.readdir('a', (err, files) => {
  console.log(files) // [ 'a.txt', 'b' ]
})
```

#### unlink

删除 a 目录下的 a.txt 文件

```js
fs.unlink('a/a.txt', (err) => {
  if (!err) {
    console.log('删除成功')
  }
})
```