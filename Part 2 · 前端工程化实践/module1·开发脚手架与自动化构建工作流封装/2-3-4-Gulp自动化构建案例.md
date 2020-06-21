## useref 文件引用及压缩处理

在html中有时会引入一些css 或者js 文件，这些文件当我们打包完成之后就会出现文件路径不对应的情况。

针对这个问题可以使用一个 useref 的插件，使用这个插件可以自动地处理html中的构建注释。

按照这些构建注释，useref 可以帮我们将文件打包到指定的目录中，并且在这个过程中还可以对文件进行压缩等操作。

```
yarn add gulp-useref --dev
```

```js
const useref = () => {
    return src('dist/*.html, { base: 'dist })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        .pipe(dest('dist'))
}
```

这个gulp 任务的入口文件时打包之后的dist中的html文件，出口文件也是文件的源路径，所以这个任务应该在构建任务的最后去执行。

useref会把对应的引入文件合并打包并且自动的引入到html中，但也只是对这些文件进行了简单的合并和引入操作，我们可以在这个过程中对文件进行一些其他的优化操作，例如压缩。

```
yarn add gulp-htmlmin gulp-uglify gulp-clean-css gulp-if --dev
```

```js
const useref = () => {
    return src('dist/*.html, { base: 'dist })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        // 文件流流到这一步的时候，会多种不同格式的文件，html js css
        // 所以这里需要对这三种文件分类进行不同的操作，所以这里除了安装对应文件的压缩插件之外还额外安装了一个gulp-if插件用于判断文件的类型。
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin()))
        .pipe(dest('dist'))
}
```

上面的这个useref任务每次执行之前需要再去执行一次compile任务，因为，这个任务每次的执行都依赖于html中的构建注释，每次按照构建注释执行完之后生成的新的html中会将这些注释删除掉，所以每次执行这个任务之前都需要去重新生成这些html文件。

但是，当按照上面的执行之后，还会发现有些文件并没有生成或者是，文件的内容是空的，这个是因为这个useref这个任务的读写流目标都是同一个目录，所以会出现一边往里面写文件同时还从里面读文件的情况，也就是会有文件读写冲突的问题。

解决这个问题最简单的就是直接生成一个新的目录

```js
const useref = () => {
    return src('dist/*.html, { base: 'dist })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        // 文件流流到这一步的时候，会多种不同格式的文件，html js css
        // 所以这里需要对这三种文件分类进行不同的操作，所以这里除了安装对应文件的压缩插件之外还额外安装了一个gulp-if插件用于判断文件的类型。
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin()))
        .pipe(dest('release'))
}
```

解决完这个问题之后，还会有一个问题就是，构建完成之后，html文件并没有被压缩，这个是因为，htmlmin这个插件默认只是会将html中的空白字符删除，并不会将文件代码中的换行符等删除，所以这里在使用这个插件的时候，还需要给这个任务配置一个参数 collapseWhitespace 为 true 以及其他一些类似的问题。

```js
.pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
    collapseWhitespace:true,
    // 将html中的css压缩
    minifyCSS: true,
    // 将html中的js压缩
    minifyJS: true
 })))
```

htmlmin中还有一些其他的可以配置的属性，比如说空属性的删除，html的注释等等，自行查询文档。

## 重新规划构建过程

上面由于同时读写 dist 这个目录造成的读写冲突，我们使用了一个另外的目录作为目标目录，然而这个新的目录中又没有我没项目中的图片和字体文件，所以之前的项目结构在使用useref之后就被破坏了，所以现在需要去规整一下项目的结构。

其实按照之前的构建流程，将src目录中的文件编译之后都放到了 dist 中，但是后续还是用 useref 进行文件的引入构建最终放到了 release 中，所以说像script，style，html直接放到 dist 中时不合理的，而是应该将这些个文件先放到一个临时目录中，然后使用 useref 将这个临时目录中的html进行相关的构建操作之后再放到 dist 中。

## 补充

- 在将项目构建文件完成之后，可以将对外暴露出去的构建的命令，使用 scripts 在 package 中，让小伙伴们更加容易理解。

- gitignore中得将打包生成的文件目录给添加进去。
