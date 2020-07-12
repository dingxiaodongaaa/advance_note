# Hash 和 History 模式

## Hash 和 History 模式的区别

首先需要强调的是不管哪种模式都是客户端路由的实现方式，也就是当路径放生变化之后不会向服务器发送请求，是用 js 监视路径的变化的变化，然后根据不同的地址渲染不同的内容如果需要服务端内容的话，需要使用Ajax发送请求。

### 表现形式的区别

- Hash 模式

https://music.136.com/#/user?id=10029 这种模式的地址中带有 # 号， # 号后面就是路由地址可以使用 ？ 携带路由参数，官方文档中说这种模式很丑，路径中带着一些与地址无关的符号，比如井号和问好。

- History 模式

https://music.136.com/user/10029 

#### 原理的区别

- Hash 模式是基于锚点，以及 onhashchange 事件

通过锚点的值作为路由地址，当地址发生变化后触发 onhashchange 事件，根据路径决定页面渲染的内容。

- History 模式是基于 HTML5 中的 History API
 
 - history.pushState()  IE10 以后才支持
 - history.relplaceState() 

pushState 方法和 push 方法的区别

当调用 history.push 方法的时候，路径会发生变化，这个时候要想服务器发送请求，而调用 history.pushState 方法不会向服务器发送请求，只会去改变浏览器地址栏中的地址，并且把这个地址记录到浏览器历史记录里，所以通过 pushState 可以实现客户端路由。但是使用 history.pushState 是有兼容性问题的。如果想要兼容 IE9 及以前的版本需要使用 Hash 模式。

## History 模式的使用

- History 模式需要服务器的支持

在 spa 中只有一个页面 index.html 服务端不存在 http://www.testurl.com/login 这样的地址，如果前端去请求这个路径会返回404。

所以需要在服务端配置除了静态资源外都返回单页面应用的 index.html。

(vue-cli 配置的本地开发服务器已经配置好了 history 模式，所以不会出现前面说的404问题)

## History 模式 - Node.js

下面是使用 node.js 搭建的一个服务器。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200702205504886.png)

```js
// app.js
// 导入 express 模块
const express = require('express')
// 导入处理history模式的模块
const history = require('connect-history-api-fallback')
const path = require('path')

const app = express()
// 注册 history 模式的中间件
// app.use(history())
// 处理静态资源的中间件 网站根目录 "../web"
app.use(express.static(path.join(__dirname, '../web')))

app.listen(3000, () => {
  console.log("服务开启，端口3000")
})
```

将打包好的前端应用放到服务器的静态资源目录中，执行命令 `node app.js`启动服务。

然后打开服务器，访问 localhost:3000 会发现，成功访问了 web 页面。

而且点击路由跳转都是可以实现的，但是点击路由之后，按 F5 刷新页面，发现返回了一个浏览器默认的 404 页面。

因为现在开启的是 history 模式，history 模式是基于 History API （即 history.pushState, history.replaceState）实现的。当点击详情按钮的时候，会去调用 `history.pushState` api ，这个 api 会去改变浏览器地址栏中的地址，但是并不会发送请求，并且还会把地址保存到历史记录里。但是注意前面说的所有的操作都是在客户端完成的。然后我们访问一下登录页，肯定也是没有问题的，但是 F5 刷新浏览器，此时，浏览器会向服务器发送请求，请求地址就是浏览器地址栏中的地址，但是我们在 node 服务器中并没有去处理这个地址，所以这个时候 node 服务器输出一个默认的 404 页面就是我们在浏览器看到的页面。这就是使用 history 模式没有浏览器支持的问题。

这里使我们的 node 服务器支持 history 模式只需要将上面 use 方法的注释放开，然后重启服务器就可以了。这个时候再去访问页面就不会有上面的问题了。此时，当刷新浏览器的时候，根据地址去请求服务器，服务器发现请求页面不存在，将 spa 的默认的首页 index.html 返回给浏览器，浏览器接收到这个页面之后，会再去判断路由地址，然后根据路由地址渲染对应的页面。

## History 模式 - Ngix

- 安装 nginx 

    - `start nginx` 启动(默认80端口)
    - `nginx -s reload` 重启
    - `nginx -s stop` 停止

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200703193528839.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_16,color_FFFFFF,t_70)

运行 nginx 启动命令之后，启动成功是没有任何提示的，但是如果 80 端口被占用，启动失败了，也是不会有任何提示信息的。打开浏览器试一试便知。直接打开浏览器输入 localhost 因为默认是 80 端口，所以不需要输入端口号直接回车就可以了。

完了之后直接将打包后的项目目录放到 nginx 的 html 目录下，然后访问 localhost 发现，项目成功部署，但是当跳转到 about 路由之后再刷新页面就出现了 404 错误。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200703194503932.png)

要想解决这个问题就需要配置 nginx 支持 history 路由。需要更改 nginx 的配置文件。配置方法如下：

```conf
# conf/nginx.conf 文件

server {
    #监听的端口
    listen 80;
    #绑定的域名
    server_name localhost;
    #指定网站的根目录
    location / {
        root html;
        #默认的首页
        index index.html index.htm;
        #支持history的配置
        try_files $uri $uri/ /index.html;
    }
}
```

只需要添加上面 `try_files $uri $uri/ /index.html;` 这一句配置就可以了。`$uri` 是当前浏览器请求的路径，如果找到了就直接返回，如果没有找到继续找,`$uri/` 是指将请求的路径作为目录然后找当前目录下的首页 index.html / index.htm 如果找到了直接返回，否则直接跳转到首页。

下面再来理一遍 history 模式下请求一个不存在的路径的执行流程

- 当刷新浏览器的时候，就会向服务器请求 `http://127.0.0.1/about` 这个地址。
- 服务器接收到这次请求就去找这个路径在服务器上对应的文件，但是服务器中根本就没有。
- 然后服务器就会直接返回 index.html 。
- 浏览器接收到 index.html 之后还会去判断当前的路由地址，然后解析渲染对应的组件。

到此，成功在 nginx 服务端实现了对 history 模式的支持。