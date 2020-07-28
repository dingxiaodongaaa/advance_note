# 面试题汇总

## 中科软外包，泰康人寿（vue）

### 1. `watch` `computed`各自的特点，如何选择，举例说明。

- watch
  - watch 一次只能监听一条数据
  - 如果需要根据监听的数据派生一条新数据的话，需要提前在 data 中挂载一条新数据
- computed 
  - 一次可以同时监听多条数据
  - 派生数据不需要提前挂载到 data
  - computed 会创建缓存，只有值发生变化的时候才会去计算

- 当一个属性受多个属性影响的时候就需要用到 computed (出生年月日计算年龄)
- 当一条数据影响多条数据的时候就需要用 watch (搜索数据)

2. 是否用过 keep-alive？ 什么作用？ active？ deactive？
3. 页面的渲染过程？css、html、js、引入顺序？

- 页面渲染的过程：
  - 根据 HTML 解析 DOM 树
    - DOM 树解析的过程是一个深度优先遍历。即先构建当前节点的所有子节点，再构建下一个兄弟节点。
    - 构建 DOM 树的过程中如果遇到 script 标签，暂停 DOM 树的构建，直到 JS 脚本执行结束。（虽然会停止 DOM 构建，但是会继续识别脚本后面的资源，并进行预加载）
  - 根据 CSS 解析生成 CSS 规则树
    - 解析 JS 规则树时，JS 执行将暂停，直至 CSS 规则树就绪。
    - 浏览器在 CSS 规则树全部准备好之前不会进行渲染。
  - 结合 DOM 树和 CSS 规则树，生成渲染树
    - DOM 树和 CSS 规则树全部准备好之后，浏览器才会开始构建渲染树。
    - 精简 CSS 可以加快 CSS 规则树的构建，从而加快页面的构建速度。
  - 根据渲染树计算每一个节点的信息（布局）
    - 布局：通过渲染树中渲染对象的信息，计算出每一个渲染对象的位置和尺寸
    - 回流：在布局完成后，发现某个位置发生变化影响了布局，就需要倒回去重新渲染（问题：倒回去重新渲染的意思是全部推倒重建吗？）
  - 根据计算好的信息绘制页面
    - 绘制阶段，系统会遍历呈现树，并调用呈现器的 "paint" 方法，将呈现器的内容显示在屏幕上。
    - 重绘：某个元素的背景元素、字体颜色等不影响元素周围或内部布局的属性，将只会引起浏览器的重绘。
    - 回流：某个元素的尺寸发生了变化，则需要重新计算渲染树，重新渲染。

- 根据上述页面的渲染过程，由于脚本执行和 CSS 解析都会阻塞页面的构建，而且渲染树又必须等到 CSS 规则树和 DOM 树构建完成之后才会开始构建，所以 html,css,js 应该符合 css > html > js 的基本引入顺序。

4. Vue 生命周期，Vue 指令有哪些？ v-if 和 v-for 为什么不能一起用？



5. vuex 作用，流程。
6. JQ 选择器有哪些？Vue 和 JQ 的区别？

- JQ 选择器：元素选择器，id选择器，class选择器，属性选择器，*选取所有元素等。

- JQ 是通过封装原生js操作 DOM 的方法实现链式调用，其本质上还是通过频繁的 DOM 操作来实现页面的刷新渲染。
- Vue 是通过虚拟 DOM 和 Diff 算法，将 DOM 转化为 js 对象存储，当需要刷新渲染的时候，会去调用 patch 方法比对新旧虚拟 DOM 将页面的更改以打补丁的方式更新。当面对复杂 DOM 操作的需求的时候，虚拟 DOM 可以大大减少真实 DOM 操作的次数，减小浏览器操作 DOM 的开销以提高性能。
- Vue 是一个 MVVM 框架，实现了数据的双向绑定，model 和 view 的双向绑定使得我们只需要关心业务逻辑的处理，不必关心操作 DOM 的问题。

7. 构造函数用箭头函数还是普通函数？为什么用普通函数？

构造函数使用普通函数的方式，构造函数中需要使用 this 来将实例所需要的属性和方法挂载到实例上面，箭头函数是没有 this 的机制的，它不会影响 this 的指向，也就是说箭头函数中的 this 指向的是他外部的 this ，这样并不能满足构造函数构造实例的需求。

8. vue-cli 用的版本？4 创建后最外层都有什么文件？说一下2、3、4的区别。
9. 配置文件里都有什么？（配置反向代理...）
10. 请求头携带 cookie 怎么全局配置？

axios 请求拦截中通过拦截 request 给请求设置相应的参数。

```js
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
```

11. rem 布局是如何使用的？移动端为什么要使用 rem 布局？em 和 rem 的区别？

- rem 布局是根据根元素的 font-size 作为 px 和 rem 的换算关系来计算的。所以我们可以通过监听屏幕尺寸的变化来动态的设置根元素的 font-size 达到不同尺寸屏幕适配的目的。

- 移动端使用 rem 布局是因为移动端设备屏幕尺寸的多样性，而 rem 布局可以使用一套样式解决不同屏幕尺寸的适配问题。

- em 是相对于父元素的 font-size 来计算的。

12. ES6新特性？ Promise ？ async/await ？箭头函数中的 this 指向？

