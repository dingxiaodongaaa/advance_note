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
### 6、async/await 如果右边方法执行出错该怎么办？（百度一面 2020）
### 7、说一下 event loop 的过程？promise 定义时传入的函数什么时候执行？（小米 三面）
### 8、说一下防抖函数的应用场景，并简单说下实现方式 （滴滴）
### 9、说一下V8的垃圾回收机制 （小米）
### 10、performance API 中什么指标可以衡量首屏时间
### 11、在 EcmaScript 新特性中，暂时性死区有什么作用
### 12、观察者模式和发布订阅模式的区别标题
### 13、gulp自己写过任务吗？说一下它的构建流程（阿里 2018）
### 14、package-lock.json 有什么作用，如果项目中没有它会怎么样，举例说明
### 15、webpack 常用配置项有哪些，并说明用途  （跟谁学 2020）
### 16、阐述 webpack css-loader 的作用和原理？ （跟谁学）
### 17、webpack中loader和plugin的区别是什么 （字节跳动 搜狐）
### 18、webpack、rollup、parcel 它们的优劣？
### 19、babel.config.js 和 .babelrc 有什么区别？
### 20、webpack 中 tree shaking 的用途和原理是什么？
### 21、阐述一下  eventbus 的原理，讲述eventbus在vue中的实践   （猿辅导）
### 22、vue-loader 的实现原理是什么