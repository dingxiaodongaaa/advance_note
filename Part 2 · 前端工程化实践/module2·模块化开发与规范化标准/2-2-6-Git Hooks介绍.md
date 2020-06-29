# Git Hooks 介绍

虽然项目的构建都会集成 lint ，但是在开发过程中难免会出现提交代码之前忘记 lint 的可能。这就可能影响到提交的代码质量。显然光靠口头的约束是不足以完全避免这种问题的。

解决方法就是通过 Git Hooks 在代码提交之前强制 lint

## Git Hooks 介绍

- Git Hooks 也称之为 git 钩子，每个钩子都对应一个任务（如：commit、push等）
- 通过 shell 脚本可以编写钩子任务触发时要执行的操作。


## 快速上手

在 .git 文件中有一个 hooks 文件目录，里面有一些钩子任务的 sample 文件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200629205452300.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

我们要在git commit之前执行 lint 需要在 pre-commint 这个文件中编写需要执行的脚本。

```shell
#!/bin/sh
# 将无关代码删除，这里只写一个简单的打印操作。
echo "before commit"
```

上述的脚本就是在commit之前控制台打印 `before commit`

效果如图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020062921030694.png)

## ESLint 结合 Git Hooks

上面认识到了 Git Hooks 的工作机制，下面实现以下我们最初的梦想。

首先安装一个 npm 模块，帮助我们写 shell 脚本，实现 Git Hooks 的使用需求。

**使用 husky 之前需要将前面自己手动添加的 pre-commit 文件删除，否则会影响 husky 的执行**

```
yarn add husky --dev
```

然后在 package.json 文件中配置 husky 

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "yarn lint"
    }
  }
}
```

配置完成之后，在之后的 git 提交代码的时候就会先去执行 yarn lint 检查代码了。但是如果想在检查完之后想让经过检查的代码进行格式化或者说直接将格式化后的代码添加到暂存区，这时 husky 就显得有点不够用了。这个时候 lint-staged 闪亮登场，它可以配合 husky 实现一些其他的功能。

```
yarn add lint-staged --dev
```

然后在 package.json 文件中配置 lint-staged 

```json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "husky": {
    "hooks": {
      "pre-commit": "yarn precommit"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint",
      "git add"
    ]
  }
}
```
