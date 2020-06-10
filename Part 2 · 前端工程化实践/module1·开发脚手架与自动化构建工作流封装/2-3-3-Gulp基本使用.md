# gulp 基本使用

gulpfiles.js

```js
// gulp 的入口文件
// 运行在node中，所以可以使用CommonJS规范

// 在最新的gulp中，取消了同步代码模式，约定每一个任务都是一个异步的任务，
// 当一个任务执行结束之后需要通过回调函数标记这个任务完成。
exports.foo = done => {
    console.log(222)

    done() // 标识任务的完成
}

// default 任务只需要执行 gulp 就会默认执行
exports.default = done => {
    console.log("default task")
    done()
}

// 在 gulp4.0 之前，需要使用gulp的方法来注册任务

const gulp = require("gulp")

gulp.task('bar', done => {
    console.log("bar task")
    done()
})
```

虽然在 gulp4.0 之后还是保留了这个创建任务的API，但是已经不被推荐使用了，更应该使用 exports 的方式来导出任务。

## gulp 创建组合任务

```js
const { series, parallel } = require("gulp")

const task1 = done => {
    setTimeout(() => {
        console.log('task1 working')
        done()
    }, 1000)
}
const task2 = done => {
    setTimeout(() => {
        console.log('task2 working')
        done()
    }, 1000)
}
const task3 = done => {
    setTimeout(() => {
        console.log('task3 working')
        done()
    }, 1000)
}

exports.foo = series(task1, task2, task3)
// 串行任务的使用场景，比如部署任务中，需要先执行编译任务，所以可以使用串行的模式执行。

exports.bar = parallel(task1, task2, task3)
// 并行任务的使用场景，比如在编译项目中 css 和 js 的时候，这两个任务是互不干扰的，所以就可以使用并行任务的模式来执行。
```

##  gulp 异步任务的三种方式

gulp 中的任务都是异步任务，即 js 中的异步函数，异步函数是不知道函数在什么时候执行完成的，都是在回调函数中去进行完成之后的操作。在 gulp 的异步任务中同样面临如何通知 gulp 异步任务的完成情况的问题。

### 通过回调的方式

```js
exports.callback = done => {
    console.log("cllback task")
    done()
}

exports.callback_error = done => {
    console.log("cllback task")
    done(new Error('task failed!'))
}
```

同样也是错误优先回调函数，当发生错误之后就会抛出错误并停止执行未执行的任务

### Promise

Promise 可以避免回调过深的问题

```js
exports.promise = () => {
    console.log('promise task')
    return Promise.resolve()
}

// gulp 中会自动地忽略 resolve 中返回地值，所以也不需要给 resole 传值

exports.promise_error = () => {
    console.log('promise task')
    return Promise.reject(new Error('promise task dailed'))
}
```

### async await（node8以上）

```js
const timeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

exports.async = async () => {
    await timeout(1000)
    console.log('async task')
}
```

### stream 方式（最常用的）

```js
const fs = require('fs')

exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')
    readStream.pipe(writeStream)
    return readStream
}

// stream 流都有一个 end 事件，当执行完流操作之后就会触发这个 end 事件，通知 gulp 任务结束

exports.stream_done = done => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')
    readStream.pipe(writeStream)
    readStream.on('end', () => {
        done()
    })
    // return readStream
}
```