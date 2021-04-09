### 1、lodash 按需引入，项目中建一个单独的 js 文件进行管理引入的工具函数
### 2、eslint vue 规范 https://cn.vuejs.org/v2/style-guide  https://eslint.vuejs.org/rules/
### 3、git commit 规范 http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html
### 4、动态引入的图片，使用 import 作为进行引入，作为变量使用
### 5、项目启动或者迭代版本启动的时候需要由开发先确认技术方案并进行评审,评审过程中必须要有对全局的影响,是否增加或修改全局的工具或者组件,并对全局的更改进行严格的评审.(任何全局组件或者全局工具的引入或修改都需要经 leader 评审是否有必要)
### 6、vue-cli 创建的项目,打包优化方案.(这个可以出一个可靠的方案,记录复用)
### 7、项目中如果使用 z-index 控制元素层级的显示，一律禁止使用复数，保证 z-index 之间的层级控制都是在兄弟元素之间断定。（https://github.com/lijinghust/lijinghust.github.com/issues/2）核心思想就是分层级，使用 z-index 在兄弟元素之间控制渲染层级。
### 8、项目启动之前设计评审需要对通用基础组件在设计和开发之前同步一遍，比如：按钮组件、toast组件等。
