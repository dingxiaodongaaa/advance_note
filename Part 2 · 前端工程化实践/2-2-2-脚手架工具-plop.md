# Plop

在开发过程中，经常回去创建相同类型的文件，例如在react项目中每一个组件都会由三个文件组成，分别是 `.js` `.css` `.test.js` ,这样每次在创建一个组件的时候都需要去手动的创建这三个文件，而且每个文件中还会由很多基础的代码。每次都得复制很麻烦。

plop这个清凉的脚手架就可以帮助我们轻易的去完成一个组件的创建

## plop 基本使用

1. 新建一个plopfile.js文件

这个文件是 Plop 的入口文件，需要导出一个函数，这个函数接收一个`plop`对象，用于创建生成器任务。

```js
// plopfile.js
// Plop入口文件，需要导出一个函数
// 此函数接收一个plop对象，用于创建生成器任务

module.exports = plop => {
    plop.setGenerator('webpage', {
        description: 'create a new webPage',
        prompts: [
            {
                type: 'input',
                name: 'title',
                message: 'webPage title',
                default: 'document'
            }
        ],
        actions: [
            {
                type: 'add', // 代表添加文件
                path: 'webPages/{{title}}/{{title}}.html',
                templateFile: 'plop-templates/webPage.html.hbs'
            },
            {
                type: 'add', // 代表添加文件
                path: 'webPages/{{title}}/{{title}}.css',
                templateFile: 'plop-templates/webPage.css.hbs'
            },
            {
                type: 'add', // 代表添加文件
                path: 'webPages/{{title}}/{{title}}.js',
                templateFile: 'plop-templates/webPage.hbs'
            }
        ]
    })
}
```

2. plop-templates目录

// 用于创建模板

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200607093836396.png)

3. 执行 

```
yarn plop webpage
```

## 总结

- 将`plop`模块作为项目开发依赖安装
- 在项目根目录下创建`plopfile.js`文件
- 在`plopfile.js`文件中定义脚手架任务
- 编写用于生成特定类型文件的模板
- 通过`plop`提供的CLI运行脚手架任务

案例地址：https://github.com/dingxiaodongaaa/plop-hbs-demo