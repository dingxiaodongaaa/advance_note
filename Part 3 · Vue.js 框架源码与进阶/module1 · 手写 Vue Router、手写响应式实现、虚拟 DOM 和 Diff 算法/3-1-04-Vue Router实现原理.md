# Vue Router 实现原理

## 前置知识

- 插件
- 混入
- Vue.observable()
- 插槽
- render 函数
- 运行时和完整版的 Vue

Vue Router 是前端路由，当路径切换的时候在浏览器端判断当前路径，并加载当前路径对应的组件。

Hash 模式是把井号后面的内容作为路由地址，可以直接通过 location.url来切换浏览器中的 url 地址，如果值改变了#后面的内容，浏览器不会向服务器请求这个地址，但是会把这个地址记录到浏览器的访问历史中，当 hash 改变后，需要监听 hash 的变化并做相应处理，即使用 onhashchange 事件，hash改变会触发 onhashchange 事件，在事件中记录当前的路由地址并找到该路径对应的组件然后重新渲染。

History 模式路径就是一个普通的url，通过调用 history.pushState() 方法改变地址栏。pushState() 方法仅仅是改变浏览器的地址栏，并把当前地址记录到浏览器的历史记录中，并不会真正的跳转到指定的路径,也就是说浏览器不会向服务器发送请求.通过监听 popstate 事件可以监听到浏览器历史操作的变化,在 popstate 事件的处理函数中可以记录改变后的地址,但是调用 history.pushState() 或者  history.replaceState() 的时候不会触发该事件,只有当点击浏览器的前进或后退按钮的时候或者调用 history.back() 或 history.forward() 的时候该事件才会被触发.当地址发生变化之后,会根据当前的地址找到对应的组件进行重新渲染. 