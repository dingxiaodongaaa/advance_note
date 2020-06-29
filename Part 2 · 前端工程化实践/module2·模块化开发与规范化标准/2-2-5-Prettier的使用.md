# Prettier 的使用

Prettier 是一款通用前端代码格式化工具，几乎可以完成所有类型代码文件的格式化工作，可以通过它完成代码的格式化，包括markdown文档格式化。

Prettier 可以格式化的文件类型包括：`html` `css` `js` `json` `scss` `md` `jsx` `vue`。

## 快速上手

1. 安装

```
yarn add prettier -dev
```

2. 执行 cli 命令

```
yarn prettier filename.ext
```

执行完这个命令之后，prettier 默认的会把格式化之后的代码输出到控制台。一般情况下，我们都希望将格式化后的代码直接写到源文件当中。所以执行命令的时候需要传递一个参数。

```
yarn prettier filename.ext --write
```

如果项格式化某一个路径下的所有的文件可以以路径作为参数

```
yarn prettier .
```

通过执行上述命令就可以将当前目录下的所有的文件进行格式化。

*实现格式良好的代码不应该依赖于插件，更应该的是保持良好的编码习惯，这是一个合格的coder的基本素质。*
