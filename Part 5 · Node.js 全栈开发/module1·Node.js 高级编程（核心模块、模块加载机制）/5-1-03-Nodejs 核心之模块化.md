# Nodejs 中的模块化

- CommonJS 规范

规定每一个文件都是一个模块，每一个模块都有自己独立的作用域，在自己的作用域内维护自己私有的变量函数等。通过 exports 和 module.exports 对外导出变量，使用 require 进行引入。

CommonJS 是属于语言层面上的规范，类似于 ECMAScript 模块化只是众多规范中的一种，还有 IO 流，二进制，buffer操作的规范。

由于 CommonJS 规范加载模块是同步加载的，所以就不适合在浏览器中使用。原因显而易见，在后端读取文件都是直接从磁盘中读取，但是在浏览器中是通过网络加载的。

- AMD 规范

针对于 Commonjs 的同步加载，AMD 规范就是专门针对于浏览器使用的模块化规范，它是以异步的方式去加载模块。通过 define 定义导出模块，通过 require 来引入模块，最经典的代表就是 requirejs 。

- CMD 规范

它整合了 CommonJS 和 ADM 两个规范的特点，专门实现了浏览器环境下的异步加载，最近的代表就是 cjs。

- ES modules 规范

JavaScript 语言层面上实现的模块化，通过 export 导出，通过 import 引入。

## Nodejs 与 CommonJS

- 任意一个文件就是一个模块，具有独立作用域
- 使用 require 导入其他模块
- 将模块 ID 传入 require 实现目标模块定位

### module 属性

- 任意 js 文件就是一个模块，可以直接使用 module 属性
- id: 返回模块标识符，一般是一个绝对路径
- filename: 返回文件模块的绝对路径
- loaded: 返回布尔值，表示模块是否完成加载
- parent: 返回对象，存放调用当前模块的模块
- children: 返回数组，存放当前模块调用的其他模块
- exports: 返回当前模块需要暴露的内容
- paths: 返回数组，存放不同目录下的 node_modules 位置
 
### module.exports 和 exports 的区别

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210525092624366.png?,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

exports 是 nodejs 自己给每一个模块提供的一个变量，它只是指向了 module.exports 指向的内存地址，所以可以直接通过 exports 导出内容，但是不能给 exports 直接赋值的，因为这样就是改变 exports 指向，赋值之后的 exports 就相当于一个局部变量了。

### require 

- 基本功能使读入并且执行一个模块，返回模块导出的对象。
- resolve: 返回模块文件绝对路径
- extensions: 依据不同后缀名执行解析操作
- main: 返回主模块对象

### 加载流程

- 路径分析：依据标识符确定模块位置

基于标识符进行模块的查找，标识符分为路径和非路径标识符两种，核心模块时非路径，自定义模块或者第三方包一般时路径。

- 文件定位：确定目标模块中具体的文件以及文件类型

假如项目下存在 m1.js 模块，导入时使用 require('m1') 语法，这种方式导入模块nodejs 是无法直接获取到文件的扩展名的，这个时候它回去依次使用 js、json、node 去补足扩展名，即去查找 m1.js、m1.json、m1.node 如果都没有查找到，就会将 m1 作为一个目录，去查找当前目录下的 package.json 文件，使用 JSON.parse() 解析取出其中的 main 属性值，如果 main 属性值没有扩展名，同样会按照 js、json、node 不全顺序去查找。 如果 main 指定的文件查找不到或者直接没有 main 属性，就会默认的将 index 作为目标模块中的具体文件名称。查找文件的时候会从当前目录中查找一直查到盘符目录下的 node_modules 为止，如果没有找到，抛出错误。

- 编译执行：采用对应的方式完成文件的编译执行

完成文件定位之后，然后就是按照不同类型的文件，对文件进行相应方式的编译和执行。

1. js 文件的编译执行

  - 使用 fs 模块同步读入目标文件内容
  - 对内容进行语法包装，生成可执行 js 函数
  - 调用函数时传入 exports 、 module、require 等属性值
2. json 文件的编译执行

  - 将读取到的内容通过 JSON.parse() 进行解析

3. 缓存优先

每次在加载模块之前都会去通过模块 id 判断当前要加载的模块是否已经加载过了，如果加载过了直接从缓存中读取。
