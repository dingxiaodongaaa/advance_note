# Vue Router 的基础使用

让我们来看一下 router/index.js 文件吧

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
// 1. 注册路由组件
// Vue.use 是用来注册组件,它里面需要接收一个参数,如果这个参数是函数的话, Vue.use 内部直接调用这个函数来注册组件,
// 如果传入的是一个对象,Vue.use 会调用这个对象的 install 方法来注册
Vue.use(VueRouter)

// 注册路由规则,通过路径对应加载相应的组件
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/blog',
    name: 'Blog',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Blog.vue')
  },
  {
    path: '/photo',
    name: 'Photo',
    component: () => import(/* webpackChunkName: "photo" */ '../views/Photo.vue')
  }
]

// 2. 创建 router 对象,创建路由对象的时候需要把声明好的路由规则作为参数传进去
const router = new VueRouter({
  routes
})

export default router
```

然后是 main.js

```js
import Vue from 'vue'
import App from './App.vue'
// 导入创建好的路由对象
import router from './router'

Vue.config.productionTip = false

new Vue({
  // 3. 在 Vue 实例中注册 router
  router,
  render: h => h(App)
}).$mount('#app')
```

最后是 App.vue

```html
<div id="nav">
  <!-- 5. 创建链接 -->
  <router-link to="/">Index</router-link> |
  <router-link to="/blog">Blog</router-link> |
  <router-link to="/photo">Photo</router-link>
</div>
<!-- 4. 创建路由组件占位 -->
<router-view/>
```

好嘞,vue-router 基础使用介绍完毕,啊哈哈哈.赶赶丹丹.

下面来好菜

## Vue 实例创建的时候,传入 router 实例的作用是什么?

首先将 main.js 中 Vue 实例中传入的 router 参数删除,然后控制台打印一下创建的 vue 实例;以及没有删除时打印的 vue 实例.

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200701212040505.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

对比可以发现,当我们创建 vue 实例的时候,配置上 router 这个选项,会给 vue 实例分别注入 $route 和 $router 这两个属性.

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020070121255386.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

$route 是我们给 route 设置的路由规则.

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200701212914509.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

$router 是我们创建的路由对象,在路由对象中有路由的一些方法和其他的属性。

其中有一个属性是 currentRoute 这个属性就是路由的规则，同 $route 一样，这是因为在有些时候，比如插件中是获取不到 $route 的，所以只能通过 $router.currentRoute 来获取当前路由规则。

## 动态路由

动态路由使用占位符来匹配我们动态传入的内容。

```js
const routes = [
  {
    path: '/detail/:id',
    name: 'Detail',
    // 开启 props 会把URL 中的参数传递给组件
    // 在组件中通过 props 来接收 URL 参数
    props: true,
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  }
] 
```

### 在组件中获取动态路由传递的参数的方法：

- 通过当前路由规则获取参数：`$route.params.id`
- 路由规则中开启 props 传参，然后通过 props 获取：`export default { props: ['id'] }`

首先第一种方式是不被推荐的，因为这种方式决定了当前的组件强依赖于路由，也就是说我们在使用这个组件的时候必须要有路由给我们传递对应的参数。为了让我们的组件不依赖于路由最好的方式就是使用第二种方式。这样组件就可以不依赖于路由在任何合适的情况下使用，只需要传递一个id的参数。

## 嵌套路由

当多个路由组件都有相同的内容，我们可以相同的部分提取到一个公共的组件中。

假如说首页和详情页都有相同的头和尾，可以把头和尾提取到 layout 组件中，在这个组件中空着的地方使用 router-view 占位，根据路由来显示首页或者是详情页。

```js
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import(/* webpackChunkName: "layout" */ '../components/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import(/* webpackChunkName: "layout" */ '../views/Index.vue')
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        props: true,
        component: () => import(/* webpackChunkName: "layout" */ '../views/Detail.vue')
      }
    ]
  }
]
```

嵌套路由会把外层的 path 和内部的 path 进行合并，然后分别取加载外层组件和内层组件，然后合并到一起，当外层的 path 是根路径的话， children 的 path 可以允许是一个空字符。children 中的 path 可以是一个相对路径也可以是一个绝对路径，空字符串其实就是一个相对路径，当访问跟路径的时候就会先去加载 layout 再去加载 index ，然后合并到一起渲染出来。

## 编程式导航

在登录页面，登录的时候需要点击登录按钮然后路由跳转，就得使用编程式导航。

### `this.$router.push`

$router.push 可以接收两种参数，一种参数是一个字符串，一种参数是一个对象。

- 接收一个字符串

`this.$router.push('/')`

字符串就是跳转到相应的路由。

- 接收一个对象

`this.$router.push({{ name: 'Index' }})`

对象是跳转到 name 属性指明的路由，这个 name 属性是在注册路由的时候注册的，这种注册了名字的路由叫做具名路由。

#### push 方法传递参数

`this.$router.push({ name:'Detail', params: { id: 1 } })`

### `this.$router.replace`

$router.replace 方法和 push 方法有些类似，都可以跳转到指定的路径，参数形式也是一样的，但是 replace 方法不会记录本次历史，它会当前的历史改为新的跳转到的历史。

### `this.$router.go`

$router.go 方法是跳转到历史中的某一个地址，可以是一个负数，如果是 -1 就是跳转到上一个页面。
