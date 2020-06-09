# Grunt 基本使用

gruntfile.js

```js
// Grunt 的入口文件
// 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数
// 此函数接受一个 grunt 的形参，内不提供一些创建任务时用到的 API

module.exports = grunt => {
    grunt.registerTask('foo', ()=> {
        console.log('hello grunt')
    })

    grunt.registerTask('bar', '任务描述', () => {
        console.log('other task')
    })

    grunt.registerTask('default', ['foo', 'bar'])

    // grunt.registerTask('task-async', () => {
    //     setTimeout(() => {
    //         console.log('async-task')
    //     },1000)
    // })

    // 异步任务需要 this.async() 返回一个done函数来声明任务的结束
    grunt.registerTask('task-async', function(){
        const done = this.async()
        setTimeout(() => {
            console.log('async-task')
            done()
        },1000)
    })
}
```

## Grunt 标记任务失败

在函数体中使用 return false 来标记任务的失败任务的失败会导致后面的任务都不再执行

```js
module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('foo')
    })

    grunt.registerTask('bad', () => {
        return false
    })

    grunt.registerTask('bar', () => {
        console.log('bar')
    })

    grunt.registerTask('default', ['foo', 'bad', 'bar'])
}
```

在运行任务的时候加一个 --force 可以强制执行所有的任务

```
yarn grunt --force
```

如果任务是一个异步的任务，就不能使用 return false 来标记任务的失败

再异步的任务中需要给done函数传递一个false的实参来标记任务的失败

```js
grunt.registerTask('async-task', function(){
    const done = this.async()
    setTimeout(() => {
        console.log('async-task')
        done(false)
    },1000)
})
```

## Grunt 的配置方法

```js
module.exports = grunt => {
    grunt.initConfig({
        foo:'foo',
        foo1: {
            bar: 'bar'
        }
    })

    grunt.registerTask('foo', () => {
        console.log(grunt.config('foo'))
        console.log(grunt.config('foo1.bar'))
    })
}
```

## Grunt 多目标任务

```js
module.exports = grunt => {
    grunt.initConfig({
        build:{
            options: {
                foo:'foo'
            },
            css: {
                options: {
                    foo:'foo1'
                },
                value: 'value'
            },
            js: 2
        },
    })
    grunt.registerMultiTask('build', function() {
        console.log(`target: ${this.target}, data: ${this.data}`)
    })
}
```

多目标任务的配置选项 options 不会被作为目标执行,在任务中可以通过 this.options() 这个方法来获取到当前任务对应的配置选项中的配置项.

在目标中可以配置自己的 options ,它会覆盖任务的 options .

在任务中可以通过 this.target 和 this.data 来获取当前执行的目标以及目标对应的值.

## Grunt 插件的使用

插件机制才是 Grunt 的核心。

```
yarn add grunt-contrib-clean --dev
```

```js
module.exports = grunt => {
    // 配置任务子目标
    grunt.initConfig({
        // 删除temp文件夹下面的app.js
        // clean: {
        //     temp: "temp/app.js"
        // }
        // 删除temp文件夹下面的所有的 txt 文本
        // clean: {
        //     temp: "temp/*.txt"
        // }
        // 删除temp文件夹下面的所有文件以及所有子目录下面的所有文件
        clean: {
            temp: "temp/**"
        }
    })

    // 加载插件任务
    grunt.loadNpmTasks('grunt-contrib-clean')
}
```

```
yarn grunt clean
```

## Grunt 常用的插件

### 1. sass

```
yarn add grunt-sass sass --dev
```

```js
const sass = require("sass")

module.exports = grunt => {
    grunt.initConfig({
        sass:{
            options: {
                sourceMap: true,
                implementation: sass
            },
            main: {
                files: {
                    'dist/css/main.css': 'scss/main.scss'
                }
            }
        }
    })
    grunt.loadNpmTasks("grunt-sass")
}
```

```
yarn grunt sass
```

以上只是 sass 插件的基础使用，更多内容查看文档

### 2. load-grunt-tasks

```
yarn add load-grunt-tasks --dev
```

该插件可以帮助我们自动地加载 Grunt 插件的任务，具体使用请看下一个 babel 案例

### 3. babel

```
yarn add grunt-babel @babel/core @babel/preset-env --dev
```

```js
const loadGruntTasks = require("load-grunt-tasks") // 自动加载所有安装的 grunt 插件的的插件
const sass = require("sass")

module.exports = grunt => {
    grunt.initConfig({
        sass:{
            options: {
                sourceMap: true,
                implementation: sass
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        babel: {
            options:{
                // 配置选项 将所有的ES新特性转换成ES5
                presets: ['@babel/preset-env'],
                sourceMap: true
            },
            main: {
                files:{
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        }
    })
    // grunt.loadNpmTasks("grunt-sass")
    loadGruntTasks(grunt) // 自动加载所有的 Grunt 插件中的任务
}
```

这里为了展示 load-grunt-tasks 插件地使用，将babel和sass放到一起。

### 4. grunt-contrib-watch

一个常见地需求就是，当文件修改完了之后我们需要让其自动地编译

```
yarn add grunt-contrib-watch --dev
```

```js
watch: {
    js: {
        files: ['src/js/*.js'],
        tasks: ['babel']
    },
    css: {
        files: ['src/scss/*.scss'],
        tasks: ['sass']
    }
}
```

```
yarn grunt watch
```

注意 grunt-contrib-watch 只是会监听对应文件的变化然后才会去执行相应的任务，初始化的时候，任务初始化执行的时候是不会自动执行对应任务的。

为解决这个问题，可以自定义一个 default 任务，初始化的时候将需要初始化执行的任务先执行一边，最后在运行watch

```js
grunt.registerTask('default', ['babel', 'sass', 'watch'])
```

```
yarn grunt
```

整个文件代码如下：

```js
const loadGruntTasks = require("load-grunt-tasks") // 自动加载所有安装的 grunt 插件的的插件
const sass = require("sass")

module.exports = grunt => {
    grunt.initConfig({
        sass:{
            options: {
                sourceMap: true,
                implementation: sass
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        babel: {
            options:{
                // 配置选项 将所有的ES新特性转换成ES5
                presets: ['@babel/preset-env'],
                sourceMap: true
            },
            main: {
                files:{
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },
        watch: {
            js: {
                files: ['src/js/*.js'],
                tasks: ['babel']
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['sass']
            }
        }
    })
    // grunt.loadNpmTasks("grunt-sass")
    loadGruntTasks(grunt) // 自动加载所有的 Grunt 插件中的任务
    grunt.registerTask('default', ['sass', 'babel', 'watch'])
}
```

demo地址：https://github.com/dingxiaodongaaa/grunt-demo