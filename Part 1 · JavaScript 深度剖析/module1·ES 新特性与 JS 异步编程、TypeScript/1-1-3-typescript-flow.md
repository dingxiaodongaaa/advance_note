# TypeScript

 解决js自有类型系统的不足，提高代码的可靠性。

 ## 内容概要

 - 强类型与弱类型
 - 静态类型与动态类型
 - Javascript自有类型系统的问题
 - Flow静态类型检查方案
 - TypeScript语言规范与基本应用

 ## 类型系统

 - 强类型与弱类型（类型安全）
 - 静态类型与动态类型（类型检查）

 强类型：在语言层面限制函数的实参类型必须与形参类型相同,强类型有更强的数据类型约束，不允许隐式数据类型转换。

 弱类型：在语言层面不会限制实参的类型,弱类型则基本没有数据类型约束，允许任意的隐式数据类型转换。

 *关于强类型和弱类型的定义并没有一个清晰的定义和界定，大多是按照个人的理解。*

 静态类型语言：一个变量声明时他的类型就是明确的，且在变量生命过后它的类型就不允许被修改了。
 
 动态类型语言：在运行阶段才会明确一个变量的类型，且变量的类型可以随时改变。

 ## JavaScript类型系统特征

 JavaScript属于动态弱类型语言。

 JS的类型决定了这门语言是非常灵活多变的，但是这同时也决定了这门语言缺失了类型系统的可靠性。

 静态语言在编译阶段会去做类型检查，而JS是一门脚本语言并不需要编译直接就可以在运行环境中运行。

 由于前端项目体量不断地增大，JS弱类型、动态类型的灵活多变的优势在这种大规模应用下就变成了短板。就比方说，js本来是用来杀鸡的，非常好用，但是随着生活水平的提升，js不光要杀鸡还得杀牛，这就显得有些力不从心了。

 ## 弱类型的问题
 
 列举一些弱类型语言js在实际应用中暴露出来的问题。

1. 由于弱类型的关系，程序中的一些异常只有等到运行时才能发现。

 ```javascript
const obj = {}
setTimeout(() => {
    obj.foo()
},50000)
 ```
 
 上述代码中，在js的语法上是完全没有问题的，但是在程序运行时就会报错。尤其是这个错误出现的时间可能会在程序执行之后的某一个时间点才会出现，这样的程序就会变得非常的不可靠。或者说，这种在语法上不会报出但是在运行时就会报错的问题明显就是一些程序中的隐患。但是在强类型语言中，当我们调用obj.foo()这个对象上面不存的方法的时候，在语法上就是不通过的，所以就可以减少代码的隐患，提高代码的可靠性。

2. 因为弱类型语言类型不明确的问题，造成函数的功能发生了变化。

```javascript
  //定义一个计算两个数字的和的方法
function sum(a, b){
    return a + b
}

console.log(sum(100, 100)) // 这样是没有问题的很香
console.log(sum(100, '100')) // 这样调用也是完全合乎语法的，但是却产生了一个出乎意料的结果
 ```

 上述的第二种情况，在小体谅单人开发的项目中也问题不大，但是在大型多人协作开发的前端项目中，就很难严格的规定每一个开发者的调用，这就是弱引用类型语言带来的不可靠性。而在强类型的语言中，它会在语法上限制函数调用传入的参数类型，也就是说第二种的调用在语法上就是不能通过的，在程序运行之前就能将问题暴露出来。

3. 因为弱类型的关系，使得我们在对象索引的使用上出现问题。

```javascript
const obj = {}
obj[true] = 100
console.log(obj['true])
 ```

 js中对象的属性名只能时字符串的形式或者是symbol，当声明的对象的属性不是这两个类型之一的时候，js会自动的将其转换成字符串保存。这就会造成“没有声明”，但是“可以取到”的类似于bug的问题。

 ## 强类型的优势

 1. 错误更早的暴露。
 2. 代码更加智能，编码更加准确。
 3. 重构更加牢靠。
 4. 减少不必要的类型判断。

 ## Flow
 
 JS的类型检查器，使用它可以避免JS弱类型带来的弊端。目前的vue和react的项目中都可以看到Flow的身影。

 通过类型注解的方式来限定变量的类型，如果类型不符合就会编码错误。这些类型注解在babel编译的时候就会去掉，所以也不会对生产环境造成影响。

 Flow不要求对每一个变量都添加类型注解，所以哪个需要就给哪个加就可以了。

 ### 快速上手

 ```javascript
// 1. yarn init --yes
// 2. yarn add flow-bin --dev
// 3. yarn flow init
// 4. yarn flow
 ```

 ```javascript
// @flow
function sum(a: number, b: number){
  return a + b
}

sum(100, 100)
sum(100, '100')
```

 由于这些类型注解只是在开发阶段帮助我们更早的发现错误的工具，在生产环境下并不需要，所以就需要在生产环境打包的时候给他将这些类型注解删除掉。

 **方法一**

```javascript
yarn add flow-remove-types --save-dev
yarn flow-remove-types src -d dist
```

 **方法二**

```javascript
yarn add @babel/core @babel/cli @babel/preset-flow --dev
```

 添加配置文件 `.babelrc` ，并添加以下配置

```javascript
{
  "presets": ["@babel/preset-flow"]
}
```

 运行以下命令

```javascript
yarn babel src -d dist
```

 ### flow开发工具插件

 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200520054553341.png)

 安装之后在每次保存之后vscode就会自动检测代码是否符合类型注解。

 不同编辑器的插件，[看这儿](https://flow.org/en/docs/editors)

 ### flow类型推断

  flow除了我们自己添加的类型注解会检测之外，他也会自动的去进行检测函数调用的参数类型是否符合。

 ### 类型注解

```javascript
 /**
 * 类型注解
 * 
 * @flow
 */ 

  function square (n: number){
      return n * n
  }

  let num: number = 100

  function foo(): void{
      console.log('hello flow')
  }
```

 ### 原始类型

 ```javascript
// @flow
// string boolean number null undefined symbol
const a: number = 100 // Infinity // NaN 

const b: string = 'aaa'

const c: boolean = true // false

const d: null = null

const e: void = undefined

const f: symbol = Symbol()
```

 ### 数组类型

```javascript
// @flow
// 数组类型
const arr1: Array<number> = [1, 2, 3]

const arr2: number[] = [1, 2, 3]

// 元组
const arr3: [number, boolean] = [100, true]
// 一般在一个函数中同时返回多个返回值的时候就可以使用元组的注解方式
```
 ### 对象类型

```javascript
// @flow
// 对象类型

const obj1: { foo: string, bar: number } = { foo: 'aaa', bar: 100 }
const obj2: { foo?: string, bar: number } = { bar: 200 }

const obj3: { [string]: string } = {}
obj3.key1 = 'aaa'
obj3.key2 = 'bbb'
```
 ### 函数类型

 ```javascript
 function foo(callback: (string, number) => void){
   callback('aaa', 100)
 }
 foo(function(str, n){
   // str => string
   // n => number
 })
 ```

 ### 特殊类型

```javascript
// @flow
// 特殊类型

// 字面量类型
const foo: 'foo' = 'foo'
const type: 'success' | 'warning' | 'danger' = 'danger'

// 联合类型
const a: string | number = 'aaa'
const b: string | number = 1

// 使用type关键词给联合类型起一个别名
type stringOrNumber = string | number
const c: stringOrNumber = 'aaa'

//maybe类型
const d: ?number = undefined // null // number
// maybe类型除了给变量添加了一个类型注解以外，该变量还可以是undefined或者null

//Mixed Any
function passMixed (value: mixed){

}
passMixed('string')
passMixed(999)

// ------------------------------
function passAny (value: any){

}
passAny('string')
passAny(999)
```
**Mixed 和 Any的区别**

使用Mixed注解的变量是强类型，Any注解的变量是弱类型。

Mixed类型其实就是所有类型的联合类型，但是该类型是不能进行隐式类型转换的，所以要想使用Mixed类型的变量，首先要先判断他的类型。

Any则是弱类型，可以是任意类型，可以随意的进行自动类型转换。

```javascript
//Mixed Any
function passMixed (value: mixed){
  if(typeof value === 'string'){
    value.substr(1)
  }
  if(typeof value === 'number){
    value*value
  }
}
passMixed('string')
passMixed(999)
```

flow类型[文档](https://www.saltycrane.com/cheat-sheets/flow-type/latest/)，仅供查阅。

### 运行环境API

js脚本必须去运行在某些运行环境之下，比如说浏览器环境、node环境。这些运行环境一定会提供给我们一些API比如在浏览器环境种的操作DOM和BOM的API。我们在开发的过程中也肯定会用这些API，所以在flow种也对这些API做出了类型注解。

```javascript
const element: HTMLElement | null = document.getElementById('app')
```

