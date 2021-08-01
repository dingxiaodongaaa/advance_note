# Nodejs 中的事件环

## 浏览器中的事件环回顾

1. 从上至下执行所有同步代码
2. 执行过程中将遇到的宏任务与微任务添加至相应的队列
3. 同步代码执行完毕后，执行满足条件的微任务回调
4. 微任务队列执行完毕后，执行满足条件的宏任务回调
5. 循环事件操作

**注意：**没执行一个宏任务之后就会立即检查微任务队列

## Nodejs 事件循环机制

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021052609330442.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

相比于浏览器只有宏任务和微任务两个队列，Nodejs 中一共又六个队列，说明如下：

- timers：执行 setTimeout 和 setInterval 回调
- pending callbacks：执行系统操作的回调，例如 tcp udp
- idle，prepare：只在系统内部进行使用
- poll：执行 I/O 相关的回调
- check：执行 setImmediate 中的回调
- close callbacks：执行 close 事件的回调

### Nodejs 完整事件环

1. 执行同步代码，将不同的任务添加至相应的队列
2. 所有同步代码执行后回去执行满足条件的微任务
3. 将所有微任务代码执行后会执行 timer 队列中满足的宏任务
4. timer 中所有宏任务执行完成后就会一次切换队列

**注意：**再完成队列切换之前会先清空微任务队列

### Nodejs 与浏览器事件循环的区别

- 任务队列数不同
  + 浏览器中只有两个任务队列
  + Nodejs 中有六个事件队列
- Nodejs 为任务执行时机不同
  + 二者都会在同步代码执行完毕后执行微任务
  + 浏览器平台下每当一个宏任务执行完毕后就清空微任务
  + Nodejs 平台在事件队列切换时回去清空微任务
- 微任务优先级不同
  + 浏览器事件环中，微任务存放于事件队列，先进先出
  + Nodejs 中 process.nextTick 先于 promise.then

### Nodejs 事件环常见问题

有下面一段代码

```js
setTimeout(() => {
  console.log('timeout')
})

setImmediate(() => {
  console.log('immediate')
})
```

上述一段代码在 Nodejs 中多次执行之后会出现不同的执行结果，即 timeout 和 immediate 打印的顺序会出现不同的情况。

原因是由于，`setTimeout(()=>{}, 0)` 这个延时器，它的延时 0 毫秒带来的不确定性，导致 `setImmediate` 的回调进入 check 队列之后，setTimeout 的回调可能并没有进入到 timer 队列中，这个时候就会出现事件环检查到 timer 队列中没有宏任务进而依次的执行到 check 队列中执行 `setImmediate` 的回调函数。导致 immediate 先于 timeout 打印。

另有一段代码

```js
const fs = require('fs')

fs.readFile('./m.js', () => {
  setTimeout(() => {
    console.log('timeout')
  })

  setImmediate(() => {
    console.log('immediate')
  })
})
```

上述一段代码在 Nodejs 中的执行结果就一定是确定的即先打印 immediate 后打印 timeout。

原因是由于，`fs.readFile` 的回调会先进入到 poll 队列中，这个时候其他的队列还是空的，所以 Nodejs 回去执行 poll 队列中的任务。执行 poll 中任务的时候会有两个任务分别进入到 timer 以及 check 两个队列，尽管这两个回调入队的顺序可能不确定，但是，执行完 poll 队列中的任务之后，事件环接下来一定会去执行 check 队列中的任务，这个时候 check 队列中一定是有一个 `setImmediate` 的回调任务的，所以会先执行 `setImmediate` 的回调，最后执行 `setTimeout` 的回调。