# Vue Router 模拟-分析

## 核心代码回顾

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// router/index.js
// 注册插件
Vue.use(VueRouter)
// 创建路由对象
const router = new VueRouter({
  routes: [
    {name: 'Home', path: '/', component: 'homeComponent'}
  ]
})

// main.js
// 创建 Vue 实例,注册 router 对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

首先导入 VueRouter 并使用 Vue.use() 注册这个插件。Vue.use 这个方法，可以传入函数或者对象，如果传入函数，Vue.use() 内部会直接调用这个函数，如果传入对象，Vue.ues() 会直接调用这个对象的 install 方法。`Vue.use(VueRouter)` 传入的是一个对象，所以后面要实现的就是这个对象的 install 方法。

接下来调用 new VueRouter() 即创建一个 Vue Router 的实例，所以 VueRouter 应该是一个构造函数或者是一个类，此处使用类的方式来创建实例。并且这个对象还有一个install 方法，因为我们前面将 VueRouter 直接传给了 Vue.use()。类本质上也是一个对象，所以 VueRouter 就是一个对象。之后再实现 VueRouter 的时候，就是要实现一个类，并且这个类里面有一个静态的 install 方法；VueRouter 的构造函数需要接收一个参数并且是一个对象的形式，里面传入了一些路由的规则，这些路由的规则主要记录的就是路由的地址和对应的组件。

最后再去创建一个 Vue 的实例，在这个 Vue 的实例中传入了创建好的 VueRouter 对象。

## VueRouter 类图

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200703205612229.png)

那接下来就是去实现这个类中的属性和方法。

### 属性

- options :  记录构造函数中传入的对象，里面是路由规则。
- routemap : 是一个对象用来记录路由地址和组件的对应关系，将来会把路由规则解析到 routemap 里面。
- data : 是一个对象，里面有一个属性 current ，用来记录当前路由地址，设置这个属性的目的是我们需要一个响应式的对象，因为路由地址变化之后对应的组件要自动更新，响应式的实现使用 Vue.observable() 方法。

### 方法

（加号是对外公开的方法，下划线是静态方法）

- Constructor : 构造函数。
- _install : 实现 Vue 的插件机制。
- init : 用来调用下面的三个方法。
- initEvent : 注册 popState 这个事件，监听浏览器历史的变化。
- createRouterMap : 初始化 routemap 属性的。把构造函数中传入的路由规则，转换成键值对的形式存储到 routemap 里面，routemap 是一个对象，键是路由的地址，值是路由对应的组件。
- initComponents : 创建 router-link 和 router-view 这个两个组件的。

## Vue Router - install

当 Vue.use() 的时候会调用 install

### 这个方法要做的事情 :

1. 判断当前插件是否已经被安装，如果已经被安装就不需要重复安装了

2. 把Vue的构造函数记录到全局变量中，因为当前的 install 是一个静态的方法，在这个静态方法中接受了一个参数Vue的构造函数，将来在 Vue 的一些实例方法中还要使用这个 Vue 的构造函数，比如说创建 router-link 、 router-view 这两个组件的时候要调用 Vue.component 来创建，所以需要把 Vue 的这个构造函数记录到全局变量中。

3. 把创建 Vue 实例时传入的 router 对象注入到所有的 Vue 实例上。我们使用的 this.$router 就是注入到实例上的。

```js
static install (Vue) {
  // 1、 
  if (VueRouter.install.installed) {
    return
  }
  VueRouter.install.installed = true
  // 2、 
  _Vue = Vue
  // 3、 
  // 混入
  // 在插件中给所有的 Vue 实例混入一个选项，在选项里面设置一个 beforeCreate ，在这个钩子函数中可以获取到 Vue 实例，然后给他的原型上注入 $router 。
  _Vue.mixin({ // 问题二： Vue.mixin 的使用
    beforeCreate () {
      // 为了避免创建组件的时候都会注入一遍，所以这里需要加判断，让它只有在创建实例的时候采取注入（只注入一次）
      if (this.$options.router) {
        _Vue.prototype.$router = this.$options.router // 问题一：this.$options 是什么？
        this.$options.router.init()
      }
    }
  })
}
```

## Vue Router - 构造函数

```js
constructor (options) {
  this.options = options
  this.routeMap = {}
  // Vue 提供的 observable 作用就是用来创建一个响应式的对象，这个对象可以直接用在渲染函数或者计算属性里面。
  this.data = _Vue.observable({
    // 记录当前的路由地址
    current: '/'
  })
}
```

## Vue Router createRouteMap

遍历所有的路由规则并解析成键值对的形式存储到 routeMap 这个对象里面。

```js
createRouteMap () {
  this.options.routes.forEach(route => {
    this.routeMap[route.path] = route.component
  })
}
```

## Vue Router - router-link&router-view

```js
initComponents (Vue) {
  const self = this
  // 为了减少方法和外部的依赖，不适用全局的 _Vue , 选择将 Vue 构造函数作为参数传入的形式。
  // 创建两个组件，分别时 router-link 和 router-view
  // 注意，如果是运行是版本的 Vue ，这里的 template 属性是不支持的，可以通过后面的 vue.config.js 配置的方式去配置使用完整版的 vue 解决这个问题
  // 但是这种配置方式会使得打包后的项目体积变大，显然不是我们想要的结果，所以这里需要我们自己实现一个 render 函数。
  Vue.component('router-link', {
    props: {
      to: String
    },
    // render 函数接收一个参数 h 函数，这个函数的作用是帮我们创建虚拟 dom ，render函数中调用这个函数并把它的结果返回，这个 h 函数是 Vue 传给我们的。
    render (h) {
      // h 函数可以接收三个参数
      // 第一个参数是我们要创建这个元素所对应的选择器，可以直接使用标签选择器。
      // 第二个参数用于给标签设置一些属性。
      // 第三个参数设置生成的元素的子元素。
      return h('a', {
        attrs: {
          href: this.to
        },
        on: {
          click: this.clickHandler
        }
      }, [this.$slots.default])
    },
    methods: {
      clickHandler (e) {
        // pushState 接收三个参数
        // 第一个是 data 将来触发 popState 的时候传给 popState 这个事件的事件对象的内容
        // 第二个是 title 网页的标题
        // 第三个是地址
        history.pushState({}, '', this.to)
        // 更新 data 对象中的 current 属性为当前地址
        this.$router.data.current = this.to
        // 因为 data 是一个响应式的对象，当 current 的值发生变化的时候，会重新加载地址栏对应的路由组件，并重新把它渲染到视图中
        // 阻止 a 标签的点击事件默认行为(跳转路由不能刷新页面)
        e.preventDefault()
      }
    }
    // template: '<a :href="to"><slot></slot></a>'
  })

  // router-view 相当于一个占位符，在 router-view 组件内部，可以根据当前路由地址获取到对应的路由组件，并渲染到 router-view 的位置
  Vue.component('router-view', {
    render (h) {
      // 在这里面先要找到当前路由的地址，再根据路由地址在 routeMap 对象中找路由地址对应的组件，然后调用 h 函数把找到的这个组件转换成虚拟 dom 直接返回
      // 当前路由地址对应的组件
      const component = self.routeMap[self.data.current]
      return h(component)
    }
  })
}
```

## Vue Router - initEvent

用来注册 popState 事件，当浏览器点击前进后退的时候触发事件，实现路由组件的切换

```js
initEvent () {
  window.addEventListener('popstate', () => {
    // 因为箭头函数不会改变 this 的指向，所以这里的 this 是指向 initEvent 中的 this ，也就是 VueRouter 对象
    this.data.current = window.location.pathname
  })
}
```


## Vue 的构建版本

- 运行时版：不支持 template 模板，需要打包的时候编译
- 完整版：包含运行时和编译器，体积比运行时版大 10K 左右，程序运行的时候把模板转换成 render 函数。

vue-cli 创建的项目默认使用的是运行时版本，因为效率高。

想要切换成完整版的的 Vue 可以通过配置 vue.config.js 的方式。

```js
module.exports = {
  runtimeCompiler: true
}
```

runtimeCompiler 的作用就是在运行是将 templte 属性，编译成 render 函数。

但是问题来了，当我们平时使用单文件组件的时候，一直都在些 template 模板，而且一直都正常工作，这是因为在打包的过程中，把单文件的 template 编译成了 render 函数，这叫做预编译。


## 全部代码

```js
// vuerouter/index.js
let _Vue = null

export default class VueRouter {
  static install (Vue) {
    // 这个方法要做的事情
    // 1、 判断当前插件是否已经被安装，如果已经被安装就不需要重复安装了
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2、 把Vue的构造函数记录到全局变量中，因为当前的 install 是一个静态的方法，在这个静态方法中接受了一个参数Vue的构造函数，将来在 Vue 的一些实例方法中还要使用这个 Vue 的构造函数，比如说创建 router-link 、 router-view 这两个组件的时候要调用 Vue.component 来创建，所以需要把 Vue 的这个构造函数记录到全局变量中。
    _Vue = Vue
    // 3、 把创建 Vue 实例时传入的 router 对象注入到所有的 Vue 实例上。我们使用的 this.$router 就是注入到实例上的。
    // 混入
    // 在插件中给所有的 Vue 实例混入一个选项，在选项里面设置一个 beforeCreate ，在这个钩子函数中可以获取到 Vue 实例，然后给他的原型上注入 $router 。
    _Vue.mixin({ // 问题二： Vue.mixin 的使用
      beforeCreate () {
        // 为了避免创建组件的时候都会注入一遍，所以这里需要加判断，让它只有在创建实例的时候采取注入（只注入一次）
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router // 问题一：this.$options 是什么？
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routeMap = {}
    // Vue 提供的 observable 作用就是用来创建一个响应式的对象，这个对象可以直接用在渲染函数或者计算属性里面。
    this.data = _Vue.observable({
      // 记录当前的路由地址
      current: '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    // 遍历所有的路由规则并解析成键值对的形式存储到 routeMap 这个对象里面。
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents (Vue) {
    const self = this
    // 为了减少方法和外部的依赖，不适用全局的 _Vue , 选择将 Vue 构造函数作为参数传入的形式。
    // 创建两个组件，分别时 router-link 和 router-view
    // 注意，如果是运行是版本的 Vue ，这里的 template 属性是不支持的，可以通过后面的 vue.config.js 配置的方式去配置使用完整版的 vue 解决这个问题
    // 但是这种配置方式会使得打包后的项目体积变大，显然不是我们想要的结果，所以这里需要我们自己实现一个 render 函数。
    Vue.component('router-link', {
      props: {
        to: String
      },
      // render 函数接收一个参数 h 函数，这个函数的作用是帮我们创建虚拟 dom ，render函数中调用这个函数并把它的结果返回，这个 h 函数是 Vue 传给我们的。
      render (h) {
        // h 函数可以接收三个参数
        // 第一个参数是我们要创建这个元素所对应的选择器，可以直接使用标签选择器。
        // 第二个参数用于给标签设置一些属性。
        // 第三个参数设置生成的元素的子元素。
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandler (e) {
          // pushState 接收三个参数
          // 第一个是 data 将来触发 popState 的时候传给 popState 这个事件的事件对象的内容
          // 第二个是 title 网页的标题
          // 第三个是地址
          history.pushState({}, '', this.to)
          // 更新 data 对象中的 current 属性为当前地址
          this.$router.data.current = this.to
          // 因为 data 是一个响应式的对象，当 current 的值发生变化的时候，会重新加载地址栏对应的路由组件，并重新把它渲染到视图中
          // 阻止 a 标签的点击事件默认行为(跳转路由不能刷新页面)
          e.preventDefault()
        }
      }
      // template: '<a :href="to"><slot></slot></a>'
    })

    // router-view 相当于一个占位符，在 router-view 组件内部，可以根据当前路由地址获取到对应的路由组件，并渲染到 router-view 的位置
    Vue.component('router-view', {
      render (h) {
        // 在这里面先要找到当前路由的地址，再根据路由地址在 routeMap 对象中找路由地址对应的组件，然后调用 h 函数把找到的这个组件转换成虚拟 dom 直接返回
        // 当前路由地址对应的组件
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvent () {
    // 用来注册 popState 事件
    window.addEventListener('popstate', () => {
      // 因为箭头函数不会改变 this 的指向，所以这里的 this 是指向 initEvent 中的 this ，也就是 VueRouter 对象
      this.data.current = window.location.pathname
    })
  }
}
```




