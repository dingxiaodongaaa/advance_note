# realworld-nuxtjs

## 创建项目

- mkdir realworld-nuxtjs
- yarn init -y
- yarn add nuxt
- 配置启动脚本
- 创建pages目录，配置初始页面

## 导入页面模板

### 导入样式资源

首先根目录下创建 app.html 定制 Nuxt.js 默认的应用模板，并通过 link 标签将样式资源引入。

默认模板：

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

通过查看文档可以看到项目引入的样式资源是用了三个 link 标签

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201021170256161.png#pic_center)

由于这里链接的是外国的网站所以可能加载的很慢，影响开发体验，所以这里使用了 [jsdeliver](https://www.jsdelivr.com/) 国内的 CDN 加速服务。

- 第一个链接使用 jsdeliver
- 第二个链接国内就有，不用变
- 第三个链接可以直接下载下来,放到 static 文件夹下，引用本地css

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
    <!-- Import Ionicon icons & Google Fonts our Bootstrap theme relies on -->
    <link href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
    <!-- Import the custom Bootstrap 4 theme from our hosted CDN -->
    <link rel="stylesheet" href="/productionready.css">
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

### 配置布局组件

项目中所有的网页都有一个公共的头部和一个公共的尾部，所以处理页面之前需要先将页面公共的位置处理一下。即 layout。

```html
<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <a class="nav-link active" href="">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="">
              <i class="ion-compose"></i>&nbsp;New Post
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="">Sign up</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 子路由 -->
    <nuxt-child></nuxt-child>

    <!-- 底部 -->
    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
```

layout 组件完成之后还需要重新配置路由，使用路由嵌套的方式将其他的页面组件嵌入layout 中，并且让网页的地址不会出现layout字眼而是默认的显示layout。

具体步骤：

- 根目录下创建 nuxt.config.js

```js
module.exports = {
  router: {
    // 自定义路由规则
    extendRoutes(routes, resolve) {
      // 清除 Nuxt.js 基于 pages 目录默认生成的路由规则
      routes.splice(0)
      // 添加自定义的路由规则

      routes.push(...[
        {
          path: "/",
          component: resolve(__dirname, 'pages/layout'),
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/')
            }
          ]
        }
      ])
    }
  }
}
```
- 重新启动项目

### 配置页面组件

- 先创建组件，将模板粘贴过来
- 配置路由
- 通过判断路由动态的渲染组件的内容实现登录和注册切换

由于这里的登录和注册组件的区别不大，所以就直接使用了同一个组件，然后根据路由来动态的渲染对应的内容。

然后是配置导航链接，就是将a标签改为 nuxt-link 然后更改一下to属性。并处理导航链接高亮，配置路由选中的 className 。

### 封装请求模块配置基本路径

在根目录创建文件夹 utils/request.js 封装代码如下：

```js
import axios from 'axios'

const requeset = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 请求拦截器

// 响应拦截器

export default request
```

### 实现基本的登录功能

登录异常提示功能部分代码(主要是遍历对象以及遍历对象里面的数组属性)：

```html
<template v-for="(messages, feild) in errors">
  <li v-for="(message, index) in messages" :key="index">{{ feild }} {{ message }}</li>
</template>
```

```js
async onSubmit () {
  try {
    // 提交表单请求登录
    const { data } = await login({
      user: this.user
    })

    console.log(data)
    // TODO：保存用户的登录状态

    // 跳转到首页
    this.$router.push('/')
  } catch (err) {
    console.dir(err)
    this.errors = err.response.data.errors
  }
}
```

### 将登录状态存储到vuex容器中

由于 Nuxt.js 已经集成了 vuex 所以只需要在根目录下创建 store 文件夹，项目构建的时候就会自动的加载 vuex 模块。
创建 store/index.js 代码如下：

```js
// 这里不需要重新创建实例，直接定义并导出各模块就可以了，nuxt 会加载并注册到容器中。
// 在服务端渲染期间运行的都是同一个实例，为防止数据冲突，务必要把 state 定义成一个函数返回数据对象的形式。
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {}
```

在登录接口中提交 mutation 保存登录状态

```js
this.$store.commit('setUser', data.user)
```

### 登录状态持久化

为了防止页面刷新，vuex 中的数据丢失的问题，需要给登录状态进行持久化处理。
由于这里是同构渲染应用，所以登录状态需要在客户端以及服务端都能获取到，所以持久化将状态保存到 cookie 中。
登录的操作是在客户端完成的，并需要在客户端将登录状态保存到 cookie 中，这里采用了操作浏览器 cookie 的第三方包 js-cookie 。

首先下载这个包

```
yarn add js-cookie
```

另一个需要考虑的问题就是，由于这个操作是在客户端完成的，在服务端并不需要，所以导入这个 js-cookie 之前需要判断当前运行环境是客户端还是服务端，如果是客户端才去加载这个包。

```js
// 只有在客户端运行时才会加载 js-cookie
// process.client 时 Nuxt.js 提供的一个状态，用于判断当前是否运行在客户端
const Cookie = process.client ? require('js-cookie') : undefined
```

```js
async onSubmit () {
  try {
    // 提交表单请求登录
    const { data } = this.isLogin
      ? await login({
        user: this.user
      })
      : await register({
        user: this.user
      })

    console.log(data)
    // TODO：保存用户的登录状态
    this.$store.commit('setUser', data.user)

    // 数据持久化
    Cookie.set('user', data.user)

    // 跳转到首页
    this.$router.push('/')
  } catch (err) {
    console.dir(err)
    this.errors = err.response.data.errors
    console.log(this.errors)
  }
}
```

```js
const cookieparser = process.server ? require('cookieparser') : undefined

// 这里不需要重新创建实例，直接定义并导出各模块就可以了，nuxt 会加载并注册到容器中。
// 在服务端渲染期间运行的都是同一个实例，为防止数据冲突，务必要把 state 定义成一个函数返回数据对象的形式。
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {
  // nuxtServerInit 是 Nuxt.js 中一个特殊的 action 方法，这个 action 会在服务端渲染期间自动调用，且仅在服务端渲染期间调用
  // 作用：初始化容器数据，传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    
    // 如果请求头中由 cookie
    if (req.headers.cookie) {
      // 使用 cookieparser 把 cookie 字符串转换为 js 对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }

    // 提交 mutation 修改 state 状态
    commit('setUser', user)
  }
}
```

### 页面访问权限处理

在普通的 vue 项目中只需要通过路由拦截的方式判断路由匹配的组件是否渲染或是重定向来处理页面权限。但是在 Nuxt.js 同构渲染的应用中除了客户端的全选处理还需要服务端渲染的权限处理，所以需要使用 Nuxt.js 提供的路由中间件来做页面权限管理。

中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。

每一个中间件应放置在 middleware/ 目录。文件名的名称将成为中间件名称 (middleware/auth.js将成为 auth 中间件)。

一个中间件接收 context 作为第一个参数：

```js
export default function (context) {
  context.userAgent = process.server
    ? context.req.headers['user-agent']
    : navigator.userAgent
}
```

中间件执行流程顺序：

1. nuxt.config.js
2. 匹配布局
3. 匹配页面

其他详细说明看[文档](https://zh.nuxtjs.org/guide/routing#%E4%B8%AD%E9%97%B4%E4%BB%B6)

在项目根路径下创建文件夹 middleware 并在 middleware/authenticated.js 中管理登录的页面权限

```js
// 验证是否登录的中间件
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user) {
    // 重定向到登录页面
    return redirect('/login')
  }
}
```

middleware/notAuthenticated.js

```js
export default function ({ store, redirect }) {
  if (store.state.user) {
    redirect('/')
  }
}
```

中间件的使用，就是将定义好的中间件在所需要的组件中配置：

```html
<script>
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: ['authenticated'],
  name: 'EditorIndex'
};
</script>
```

### 列表分页要点

列表分页的时候需要使用到查询字符串切换列表的显示页，但是由于组件的切换是根据地址切换的，当只更改查询字符串不更改地址的时候，并不会触发组件的重新渲染，因此当我们点击切换页面按钮更改查询字符串的时候只会更改地址栏的查询条件，页面的组件并不会重新渲染，所以这里需要用到 Nuxt.js 中的 watchQuery 属性。

使用watchQuery属性可以监听参数字符串的更改。 如果定义的字符串发生变化，将调用所有组件方法(asyncData, fetch, validate, layout, ...)。 为了提高性能，默认情况下禁用。

如果您要为所有参数字符串设置监听， 请设置： watchQuery: true.

```js
export default {
  watchQuery: ['page', 'tag', 'tab']
}
```

### 优化异步任务

当两个异步请求之间没有联系的时候可以通过 Promise.all 并行请求提高效率。

```js
async asyncData({ query, store }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 10;
    const { tag } = query;
    const tab = query.tab || 'global_feed'
    const getArticlesHandler = (store.state.user && tab === 'your_feed') ? getFeedArticles : getArticles

    const [ articleRes, tagsRes ] = await Promise.all([
      getArticlesHandler({
        limit,
        offset: (page - 1) * limit,
        tag: tag
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagsRes.data

    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tag,
      tab
    };
  }
```

### 通过 axios 请求拦截设置 token

由于接口中往往会有公共的业务处理，比如接口请求需要携带 token 以进行权限认证。这种公共的的业务可以在 axios 拦截其中统一进行处理。

由于项目使用的是同构渲染，所以不能在封装的请求模块中获取到 store 中的状态，因此也就不能在这里统一设置 token 。

Nuxt.js 拥有插件机制，具体[文档](https://zh.nuxtjs.org/guide/plugins)

插件是一个函数，函数的默认参数为 context 上下文，我们可以利用这个插件机制从 context 中获取到我们想要的 store 。

根目录下创建 plugins/request.js 代码如下

```js
import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象（query，params，req，res，app，store...）
// 插件导出函数必须作为 default 成员
export default ({ store }) => {
  // 请求拦截器
  // Add a request interceptor
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理，例如统一设置 token
  request.interceptors.request.use(function (config) {
    // Do something before request is sent
    const { user } = store.state

    if (user && user.token) {
      config.headers.Authorization = `Token ${ user.token }`
    }

    // 返回 config 请求配置对象
    return config;
  }, function (error) {
    // 如果请求失败（此时请求还没有发出去），就会进入到这里
    // Do something with request error
    return Promise.reject(error);
  });

  // 响应拦截器
}
```

plugin 创建好了之后需要在 nuxt.config.js 中配置

```js
module.exports = {
  plugins: [
    '~/plugins/request.js'
  ]
}
```

### 时间格式处理插件 Day.js

由于项目的多个地方都需要处理时间格式，所以可以通过封装全局过滤器的方式实现资源的复用。

```js
import Vue from 'vue'
import dayjs from 'dayjs'

// {{ 表达式 | 过滤器 }}
Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})
```

然后在 nuxt.config.js 中配置

```js
module.exports = {
  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ]
}
```

调用

```html
<span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
```

### 将 Markdown 转换为 HTML

项目中的文章发布支持 Markdown 格式的文章，所以需要将发布的 Markdown 转换成 HTML 展示。

这里使用插件 markdown-it 

```
yarn add markdown-it
```

```js
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'

export default {
  name: 'ArticleIndex',
  async asyncData ({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article: data.article
    }
  }
};
```

### 设置页面 meta 优化 SEO

由于这里需要的是给文章详情页面做 SEO 优化，所以设置 meta 标签不能直接给 index.html 或者在配置文件里面添加，而是需要设置特定页面的 Meta 标签

关于个性化特定页面的 Meta 标签，请参考 [页面头部配置 API](https://zh.nuxtjs.org/api/pages-head)。

注意：为了避免子组件中的 meta 标签不能正确覆盖父组件中相同的标签而产生重复的现象，建议利用 hid 键为 meta 标签配一个唯一的标识编号。请阅读关于 vue-meta 的更多信息。

### 打包

[文档](https://zh.nuxtjs.org/guide/commands)

### 部署

一个最简单的部署流程

- 配置 Host + Port
- 压缩发布包
- 把发布包传到服务端（使用 ftp git scp...）
- 解压
- 安装依赖
- 启动服务

#### 配置 Host + Port

#### 压缩发布包

需要压缩发布的文件

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201023122110400.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70#pic_center)

#### 启动服务

如果只是在终端直接启动服务，如果在命令行退出，服务就会停止也就不能访问到这个应用，所以需要一种可以在后台运行服务的工具。

PM2 是专门用来管理 NodeJS 进程的的应用，使用它可以将 NodeJS 相关的应用运行在后台保持运行状态。

gitHub 仓库地址：https://github.com/Unitech/pm2

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201023140652512.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70#pic_center)

### 自动化部署

传统的部署方式都是在本地构建然后发布更新，虽然不难，但是需要大量的重复操作。所以就有了现代化的自动化部署方式

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020102314200727.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70#pic_center)

CI/CD 服务就是用来实现持续集成的工具，有Jenkins、Gitlab CI、Github Actions、Travis CI、Circle CI等。

以 GitHub Actions 为例

#### 配置 GitHub Access Token

- 生成：https://github.com/settings/tokens
- 配置到项目的 Secrets 中

#### 配置 Github Actions 执行脚本

- 在项目根目录创建 .github/workflows 目录
- 下载 main.yml 到 workflows 目录中
- 修改配置
- 配置 PM2 配置文件
- 提交更新
- 查看自动部署状态
- 访问网站
- 提交更新

