# 丁晓东 ｜ Part 3 | 模块一

## 简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

首先，这种方式添加的成员不是响应式数据。

如果要把新增成员设置成响应式数据，需要调用 `Vue.set()` 或者 `this.$set()`。具体就是在 `clickHandler` 中调用 `this.$set(this.dog, 'name', 'Trump')` 。

`this.$set` 内部的实现原理：

在 `this.$set` 中会去调用 `defineReactive` 这个函数，在 `defineReactive` 中，使用 `Object.defineProperty` 给 `this.dog.name` 这个属性添加 `getter/setter` 并且给它设置一个 `Dep` 对象，在 `getter` 中调用 `Dep.addSub` 收集依赖，在 `setter` 中调用 `Dep.notify` 发送通知，然后调用相应观察者的 `update` 方法更新视图，从而实现数据的响应式。

### 2、请简述 Diff 算法的执行过程。

在调用 patch 函数对 DOM 打补丁的时候，就需要使用 diff 算法来计算新旧节点的变化，然后将节点中变化的部分更新到视图（打补丁）。

#### Diff 算法的执行过程：（新节点用 vnode 表示，老节点用 oldVnode 表示）

##### 1. patch 中的执行过程

- 首先需要判断 vnode 和 oldVnode 是否是相同的节点（具体就是是否有相同的 sel 和 key）
- 如果不是相同的节点，直接创建 vnode 对应的 DOM 元素，将 oldVnode 对应的 DOM 元素替换掉。具体就是先将新的 DOM 插入到老的 DOM 的父节点上，然后将老 DOM 移除。
- 如果是相同的节点，需要调用 patchVnode 函数，对比节点的差异，然后更新视图。

##### 2. patchVnode 中的执行过程

在 patchVnode 中将新老节点分不同情况进行处理（文本内容和子节点是互斥的）

- 如果 vnode 和 oldVnode 都有子节点，调用 updateChildren ，进行对比渲染，后面详细描述。
- 如果只有 vnode 有子节点，把新节点中增加的子节点添加到页面上，替换掉 oldVnode 中的内容。
- 如果只有 oldVnode 有子节点且 vnode.text 为空，删除 oldVnode 的子节点。
- 如果 oldVnode 只有文本内容且 vnode.text 为空且没有子节点，清空对应 DOM 。
- 如果 vnode.text 不为空，且不是上述所有情况，使用 vnode 中的 text 替换掉 oldVnode 中内容。

##### 3. updateChildren 中的执行过程

在 updateChildren 中会对 vnode 和 oldVnode 中的所有的子节点进行同级的比较（这是为了让 diff 算法既可以解决大部分情况，又能使复杂度降为 O(n)）

- 在进行同级比较的时候，首先会对新老节点数组的开始和结尾节点标记索引，然后在遍历的过程中移动索引。
- 对开始和结束节点比较的时候，总共分为了四种情况，在 updateChildren 中会循环遍历新节点数组中的元素，并在每次循环中依次对下面这四种情况进行讨论。

  - oldStartVnode / newStartVnode(旧开始节点 / 新开始节点)
  - oldEndVnode / newEndVnode(旧结束节点 / 新结束节点)

    - 以上两种情况比较类似，判断 oldStartVnode 和 newStartVnode 是否是 sameVnode 。如果是，调用 patchVnode() 对比和更新节点，把旧开始和新开始索引往后移动 oldStartIdx++ / newStartIdx++ 。oldEndVnode / newEndVnode同上。

  - oldStartVnode / newEndVnode(旧开始节点 / 新结束节点)

    - 判断 oldStartVnode 和 newEndVnode 是否是 sameVnode 。如果是，调用 patchVnode() 对比和更新节点，把 oldStartVnode 对应的 DOM 元素，移到右边，最后更新索引。

  - oldEndVnode / newStartVnode(旧结束节点 / 新开始节点)

    - 判断 oldEndVnode 和 newStartVnode 是否是 sameVnode 。如果是，调用 patchVnode() 对比和更新节点，把 oldEndVnode 对应的 DOM 元素，移到左边，最后更新索引。

- 如果上述四种情况都不是，遍历新节点数组，使用 newStartVnode 的 key 在老节点数组中找相同节点

  - 如果没有找到，说明 newStartVnode 是新节点，创建新节点对应的 DOM 元素，插入到 DOM 树中。
  - 如果找到了，判断找到的节点和对一个的新节点是够有相同的 sel 。

    - 如果不相同，说明节点修改了，重新创建对应的 DOM 元素，插到 DOM 树中。
    - 如果相同，说明节点并没有修改，直接把 elmToMove 对应的 DOM 元素移到左边。
  
- 循环结束，对循环之后得到的结果进行处理

  - 如果老节点的所有子节点先遍历完(oldStartIdx > oldEndIdx)，说明新节点有剩余，把剩余节点批量插入到右边，循环结束
  - 如果新节点的所有子节点先遍历完(newStartIdx > newEndIdx)，说明老节点有剩余，把剩余节点批量删除，循环结束

## 编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

### 3、参考 Snabbdom 提供的电影列表的示例，利用 Snabbdom 实现类似的效果，如图：
