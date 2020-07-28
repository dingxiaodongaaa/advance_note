阅读 Vue.js 中遇到的小知识点，虽然很多知识点都可能会牵连出很多问题，但是为了不影响源码的阅读进程，就用到什么学习什么并以此记录。

### Rollup 中的命令行参数 `environment`

```shell
rollup -c --environment INCLUDE_DEPS,BUILD:production
```

- `-c` 的作用是指定 rollup 的配置文件，如果这个参数没有传值，会默认使用 rollup.config.js 文件作为配置文件。

- `--environemnt` 通过 `process.ENV` 将附加设置传递给配置文件。执行上述代码，将设置`process.env.INCLUDE_DEPS === 'true'` 和 `process.env.BUILD ==== 'production'`。

通过在命令行中传递参数的方式可以将预定义好的同名参数覆盖，比如：

```json
// in package.json
{
  "scripts": {
    "build": "rollup -c --environment INCLUDE_DEPS,BUILD:production"
  }
}
```

然后在命令行中执行 `npm run build -- --environment BUILD:development`。在配置文件中获取到的将是 `process.env.INCLUDE_DEPS === 'true'` 和 `process.env.BUILD === 'development'`

### node 中的 `__pathname` 和 `__dirname` 以及 `path.resolve` 和 `path.join`

- `__dirname` 获取当前模块的目录名，相当于 `__filename` 的 `path.dirname` 。

示例，从 `/Users/mji` 运行 `node example.js`

```js
console.log(__dirname); // /Users/mji
console.log(path.dirname(__filename)); // /Users/mjr
```

- `filename` 当前模块文件的文件名，这是当前模块文件的绝对路径（符号链接会被解析）

示例，从 /Users/mjr 运行 node example.js

```js
console.log(__filename); // /Users/mjr/example.js
console.log(__dirname); // /Users/mjr
```

值得注意的是，它返回的是当前模块文件的绝对路径，不一定是入口文件的绝对路径

给定两个模块：`a` 和 `b`，其中 `b` 是 `a` 的依赖文件，且目录结构如下：

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

`b.js` 中的 `__filename` 的引用会返回 `/Users/mjr/app/node_modules/b/b.js`，而 `a.js` 中的 `__filename` 的引用会返回 `/Users/mjr/app/a.js`。

- `path.join()` 方法会将所有给定的 `path` 片段连接到一起（使用平台特定的分隔符作为定界符），然后规范化生成的路径。

  - 长度为零的 `path` 片段会被忽略。 
  - 如果连接后的路径字符串为长度为零的字符串，则返回 '.'，表示当前工作目录。

- `path.resolve()` 方法会将路径或路径片段的序列解析为绝对路径。给定的路径序列会从右到左进行处理，后面的每个 `path` 会被追加到前面，直到构造出绝对路径。

  - 如果在处理完所有给定的 `path` 片段之后还未生成绝对路径，则会使用当前工作目录。

  - 生成的路径会被规范化，并且尾部的斜杠会被删除（除非路径被解析为根目录）。

  - 零长度的 `path` 片段会被忽略。

```js
// '/user' 和 'user'
// 有斜杠：代表的事根目录下的user
// 没有斜杠：标识当前目录下的user
// 有斜杠是绝对路径，没斜杠是相对路径

path.join('a', 'b', 'c') // '/a/b/c'
path.join('a', '/b', 'c') // '/a/b/c'
path.join('a/b', '../', 'c') // '/a/c'
path.join('a', './', 'c') // '/a/c'

// 假设当前目录的绝对路径为/home/user
path.resolve('a', 'b', 'c') // '/home/user/a/b/c'
path.resolve('a', '/b', 'c') // '/b/c'
path.resolve('a/b', '../', 'c') // '/home/user/a/c'
path.resolve('a', './', 'c') // '/home/user/a/c'
```

`path.join` 和 `path.resolve` 的区别

- `path.join` 就是将多个参数字符串合并成一个路径字符串。
- `path.resolve` 是以程序根目录作为起点，根据参数解析出一个绝对路径。

### 判断一个对象是否是一个原始的 Object 对象

```ts
const _toString = Object.prototype.

function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}
```