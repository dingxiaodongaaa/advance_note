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

插件机制才是 Grunt 的核心.