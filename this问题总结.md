# this 问题总结

js中的 this 问题一直自己知识体系中一个模糊的区域，所以写这篇文章来记录和厘清一下 this 指向的问题。

## this 的5种绑定方式

- 默认绑定
- 隐式绑定
- 显式绑定
- new 绑定
- 箭头函数中的 this

### 默认绑定

默认绑定的 this 在非严格模式下指向 window ，在严格模式下指向 undefined。

```js
var a = 10
function foo () {
  console.log(this.a)
}
foo() // 10
```

使用 var 创建变量的时候（不在函数里），会吧创建的变量绑定到 window 下，所以此时 a 是 window 下的属性。函数 foo 也是 window 下的属性。

上面的代码就等价于：

```js
window.a = 10
function foo () {
  console.log(this.a)
}
window.foo()
```

在这里，调用 foo 函数的是 window 对象，而且又是在非严格模式下，所以 foo 中 this 的指向是 window 对象，因此 this.a 会输出 10。

严格模式下的 this 指向

```js
"use strict";
var a = 10
function foo () {
  console.log('this1', this)
  console.log(window.a)
  console.log(this.a)
}
console.log(window.foo)
console.log('this2', this)
foo()
```

需要注意的点：

- 开启严格模式，只是说使得函数内的 this 指向 undefined ，它并不会改变全局中的 this 的指向。因此 this1 中打印的是 undefined  ，而 this2 还是 window 对象。
- 严格模式也不会阻止 a 绑定到 window 对象上面。

```js
// 打印结果
f foo() {...}
'this2' Window{...}
'this1' undefined
10
Uncaught TypeError: Cannot read property 'a' of undefined
```

还有一个问题就是 let 和 const 声明的变量是不会绑定到 window 上的（请看 [let const var 三者的区别](https://blog.csdn.net/fangxuan1509/article/details/106405736)）。

```js
let a = 10
const b = 20
function foo () {
  console.log(this.a)
  console.log(this.b)
}
foo()
console.log(window.a)
```

上面的三个都会打印 undefined

### 隐式绑定

**this永远指向最后调用它的对象**

谁最后调用的函数，函数内部的 this 就指向谁（不考虑箭头函数）


```js
function foo () {
  console.log(this.a)
}
var obj = { a: 1, foo }
var a = 2
obj.foo()
```

函数 foo 虽然是定义在 window 上，但是在 obj 对象中引用了它，并将它重新赋值到 obj.foo 上，而且 **调用它的对象是 obj ，因此打印出来的应该是 obj.a**

我觉着，这里可以通过引用数据类型来更好的理解为什么这里的 this 指向的是 obj 而不是 window。存储函数的变量本身就是一个引用数据类型，他在传值的时候传递的也是其引用地址，所以不管怎么赋值，它里面的 this 肯定是指向的最后调用它的对象,如果这个调用它的对象不存在，就是默认绑定，最终的 this 指向 window 或者是 undefined。

### 隐式绑定的隐式丢失问题

**隐式丢失其实就是被隐式绑定的函数在特定的情况下会丢失绑定对象。丢失绑定对象的函数最终会采用默认绑定的方式使函数中的 this 指向 window 或者 undefined**

两种会发生隐式丢失的情况：

- 使用另一个变量来给函数取别名
- 将函数作为参数传递时会被隐式赋值，回调函数丢失 this 绑定

```js
function foo () {
  console.log(this.a)
}
var obj = { a: 1, foo }
var a = 2
var foo2 = obj.foo

obj.foo() // 1
foo2() // 2
```

第一个为 1 不说了，隐式绑定。

第二个，虽然 foo2 指向的是 obj.foo 函数，不过调用它的确是 window 对象，所以它里面 this 的指向是为 window。

```js
function foo () {
  console.log(this.a)
}
var obj = { a: 1, foo }
var a = 2
var foo2 = obj.foo
var obj2 = { a: 3, foo2: obj.foo }

obj.foo() // 1
foo2() // 2
obj2.foo2() // 3
```

- obj.foo() 中的 this 指向调用者 obj
- foo2() 发生了隐式丢失，调用者是 window ，使得 foo() 中的 this 指向 window
- foo3() 发生了隐式丢失，调用者是 obj2 ，使得 foo() 中的 this 指向 obj2

其实，上面所说的两个隐式丢失的例子，如果你以函数是一个引用数据类型这个特性来思考的话，就显得非常容易理解，所谓的隐式丢失就是因为函数变量存储的本身就是一个引用地址，最终指向的本身就是同一个内容，传来传去，最终函数的 this 最终指向的还是它的调用者。

```js
function foo () {
  console.log(this.a)
}
function doFoo (fn) {
  console.log(this)
  fn()
}
var obj = { a: 1, foo }
var a = 2
doFoo(obj.foo)
```

这里将 obj.foo 当成参数传递到 doFoo 函数，在传递的过程中，obj.foo 函数内的 this 发生了变化，指向了 window 。

所以，结果为：

```js
Window{...}
2
```

注意，这里说的是 obj.foo 函数，而不是说 doFoo 。 doFoo 函数内的 this 本身就是指向 window 的，因为这里是 window 调用了它。

**但是不要以为是 doFoo() 函数内的 this 影响了 obj.foo .**,请看下面这种情景。

```js
function foo () {
  console.log(this.a)
}
function doFoo (fn) {
  console.log(this)
  fn()
}
var obj = { a: 1, foo }
var a = 2
var obj2 = { a: 3, doFoo}

obj2.doFoo(obj.foo)
```

现在的 doFoo 函数的 this 应该指向的是 obj2 。但是，将 obj.foo 作为参数传递给 doFoo 这个函数之后，其实就是一个引用传递，最终在 doFoo 中调用的一定是这个函数本身，而在 doFoo 中调用这个函数的时候并没有任何的调用修饰，所以他会采用默认绑定，将这个函数中的 this 绑定到 window 或者 undefined。

执行结果：

```js
{ a:3, doFoo: f }
2
```

这个例子证明，如果你把一个函数当成参数传递到另一个函数的时候，也会发生隐式丢失的问题，且与包裹着它的函数的 this 指向无关。在非严格模式下，会把该函数的 this 绑定到 window 下，严格模式下绑定到 undefined 。

相同的代码在严格模式下：

```js
"use strict"
function foo () {
  console.log(this.a)
}
function doFoo (fn) {
  console.log(this)
  fn()
}
var obj = { a: 1, foo }
var a = 2
var obj2 = { a: 3, doFoo}

obj2.doFoo(obj.foo)
```

执行结果：

```js
{ a:3, doFoo: f }
Uncaught TypeError: Cannot read property 'a' of undefined
```