# Snabbdom 源码解析

## 如何学习源码

- 先宏观了解
- 带着目标看源码
- 看源码的过程不求甚解
- 调试
- 参考资料

## 快捷键

- F12 切换到定义的位置
- ALT + 左箭头 返回到跳转到之前的代码位置

## Snabbdom 的核心

- 使用 h() 函数创建 JavaScript 对象(VNode)描述真实 DOM
- init() 设置模块，创建 patch()
- patch() 比较新旧两个 VNode
- 把变化的内容更新到真实 DOM 树上

## Snabbdom 源码

- 源码地址
  
  - https://github.com/snabbdom/snabbdom

## h() 函数

在使用 Vue 的时候就使用过 h() 函数，这个 h() 函数就是 snabbdom 中的 h，但是 Vue 中增强了 h ，实现了组件的机制，snabbdom 中的 h 是不支持组件的。h() 函数最早见于 hypescript ，使用 JavaScript 创建超文本。Snabbdom 中的 h() 函数是用来创建 VNode。

### 函数重载

  - 概念

    - 参数个数或类型不同的函数
    - JavaScript 中没有重载的概念
    - TypeScript 中有重载，不过重载的实现还是通过代码调整参数

```js
function add (a, b) {
  console.log(a + b)
}
function add (a, b, c) {
  console.log(a + b + c)
}

add(1, 2)
add(1, 2, 3)
```
在 js 中上述的代码中第一个 add 函数会被第二个 add 函数覆盖掉，但是如果是在 java 或者被 C# 这种支持函数重载的语言中，第一个函数并不会被后面的 add 覆盖掉，而是会在函数调用的时候通过参数的个数和参数的类型去调用对应的函数。这就叫做函数重载。

```ts
// h 函数重载
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData, children: VNodeChildren): VNode;
export function h(sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {}, children: any, text: any, i: number;
  // 处理参数，实现重载的机制
  if (c !== undefined) {
    // 处理三个参数的情况
    // sel、data、children/text
    // 如果 c 有值，说明传了三个参数
    // data 中的数据是模块要处理的数据
    if (b != null) { data = b };
    // 如果 c 是数组，说明是子元素
    if (is.array(c)) { children = c; }
    // 如果 c 是字符串或者数字，说明是标签中的文本
    else if (is.primitive(c)) { text = c; }
    // 如果 c 是VNode，将 c 转换成数组传给 children
    else if (c && c.sel) { children = [c]; }
  } else if (b !== undefined) {
    // 两个参数的情况，跟三个参数的时候是相同的
    if (is.array(b)) { children = b; }
    else if (is.primitive(b)) { text = b; }
    else if (b && b.sel) { children = [b]; }
    else { data = b; }
  }
  if (children !== undefined) {
    // 处理 children 中的原始值(string/number)
    for (i = 0; i < children.length; ++i) {
      // 如果 child 是 string/number，使用 vnode() 创建文本节点
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    // 如果选择器传的是 svg 要给 svg 添加命名空间
    addNS(data, children, sel);
  }
  // 创建 vnode 虚拟节点
  return vnode(sel, data, children, text, undefined);
};
// 导出模块
export default h;
```

从上面可以看出 vnode() 函数的作用就是创建一个虚拟节点并且把他返回。下面分析 vnode() 函数的实现。

## vnode()

```ts
export interface VNode {
  // interface 是 ts 中的语法，目的是用来约束对象都拥有这些属性

  // 选择器
  sel: string | undefined;
  // 节点数据：属性/样式/事件等，是 snabddom 中的模块所需要的数据，数据的类型是通过 VNodeData 这个接口约束的。
  data: VNodeData | undefined;
  // 子节点，和 text 属性互斥
  children: Array<VNode | string> | undefined;
  // 记录 vnode 对应的真实 DOM，当把 vnode 对象转换成 DOM 对象以后会把真实 DOM 存储在 elm 这个属性中。
  elm: Node | undefined;
  // 标签之间的内容
  text: string | undefined;
  // 优化
  key: Key | undefined;
}

export interface VNodeData {
  props?: Props;
  attrs?: Attrs;
  class?: Classes;
  style?: VNodeStyle;
  dataset?: Dataset;
  on?: On;
  hero?: Hero;
  attachData?: AttachData;
  hook?: Hooks;
  key?: Key;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: Array<any>; // for thunks
  [key: string]: any; // for any other 3rd party module
}

export function vnode(sel: string | undefined,
                      data: any | undefined,
                      children: Array<VNode | string> | undefined,
                      text: string | undefined,
                      elm: Element | Text | undefined): VNode {
  let key = data === undefined ? undefined : data.key;
  return {sel, data, children, text, elm, key};
}

export default vnode;
```

vnode() 函数最终返回的就是一个普通的 js 对象，使用 js 对象来描述一个 vnode 虚拟节点。

## patch(oldVnode, newVnode)

打补丁，把新节点中变化的内容渲染到真实 DOM ，最后返回新节点作为下一次处理的旧节点。

- 对比新旧 Vnode 是否是相同节点（节点的 key 和 sel 相同）
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，在判断新的 VNode 是否有 text ，如果有并且和 oldNode 的 text 不同，直接更新文本内容
- 如果新的 VNode 有 children ，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
- diff 过程只进行同层级比较

## init 函数

init 内部返回 patch 函数，把 vnode 渲染成真实 dom ，并返回vnode

```ts
export function init(modules: Array<Partial<Module>>, domApi?: DOMAPI) {
  let i: number, j: number, cbs = ({} as ModuleHooks);
  // 初始化转换虚拟节点的 api
  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;
  // 把传入的所有模块的钩子函数统一存储到 cbs 对象中
  // 最终创建的 cbs 对象的形式 cbs = { create: [fn1, fn2], update: [], ... }
  for (i = 0; i < hooks.length; ++i) {
    // cbs.create = [], cbs.update = []...
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook = modules[j][hooks[i]];
      if (hook !== undefined) {
        // 把获取到的 hook 函数放到 cbs 对应的钩子函数数组中，将来在 patch 函数调用的时候会在合适的时机调用这些函数。
        (cbs[hooks[i]] as Array<any>).push(hook);
      }
    }
  }

  // init 内部返回 patch 函数，把 vnode 渲染成真实 dom ，并返回vnode
  // 高阶函数，返回一个函数
  // 可以把调用内部函数所需要传递的所有的共同参数提取出来，在调用外部函数的时候，
  // 将共同参数传入，使程序形成闭包，当我们在之后调用内部函数的时候，就只需要传递动态的参数。
  // 而且，这样的形式可以保证共同参数在内存中只保存一份
  return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
    let i: number, elm: Node, parent: Node;
    // 保存新插入节点的队列，为了触发钩子函数
    const insertedVnodeQueue: VNodeQueue = [];
    // 执行模块的 pre 钩子函数，pre 使处理虚拟节点执行的第一个钩子函数
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    // 如果 oldVnode 不是 VNode ，创建 VNode 并设置 elm
    if (!isVnode(oldVnode)) {
      // 把 DOM 元素转换成空的 VNode
      oldVnode = emptyNodeAt(oldVnode);
    }
    // 如果新旧节点是相同节点（key 和 sel 相同）
    if (sameVnode(oldVnode, vnode)) {
      // 对比节点的差异并且更新到 DOM 上
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      // 如果新旧节点不同，vnode 创建对应的 DOM 
      // 获取当前的 DOM 元素
      elm = oldVnode.elm as Node;
      parent = api.parentNode(elm);
      // 创建 vnode 对应的 DOM 元素，并触发 init/create 钩子函数。
      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        // 如果父节点不为空，把 vnode 对应的 dom 插入到文档中
        api.insertBefore(parent, vnode.elm as Node, api.nextSibling(elm));
        // 移除老节点
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    // 执行用户设置的 insert 钩子函数
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      (((insertedVnodeQueue[i].data as VNodeData).hook as Hooks).insert as any)(insertedVnodeQueue[i]);
    }
    // 执行模块的 post 钩子函数
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    // 返回 vnode 作为下一次操作的 oldVnode 处理
    return vnode;
  };
}
```

## createElm 

它的作用是把 vnode 转换成对应的元素，但是不会把 DOM 渲染到页面上。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712184223771.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70)

```ts
function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
  let i: any, data = vnode.data;
  if (data !== undefined) {
    // 执行用户设置的 init 钩子函数
    if (isDef(i = data.hook) && isDef(i = i.init)) {
      i(vnode);
      // 这里再次给 data 更新的原因是，init 钩子函数是用户设置的，所以可能会再这个钩子函数中去改变 data 中的数据
      data = vnode.data;
    }
  }
  // 把 vnode 转换成真实 DOM 对象（没有渲染到页面）
  let children = vnode.children, sel = vnode.sel;
  if (sel === '!') {
    // 如果是感叹号就去创建注释节点
    if (isUndef(vnode.text)) {
      // 如果为 undefined ，赋值为空字符串，为了后续调用 api.createComment
      vnode.text = '';
    }
    // 创建注释节点
    vnode.elm = api.createComment(vnode.text as string);
  } else if (sel !== undefined) {
    // 如果 sel 选择器不为空
    // 解析选择器
    // 创建对应的 DOM 元素
    // Parse selector
    const hashIdx = sel.indexOf('#');
    const dotIdx = sel.indexOf('.', hashIdx);
    const hash = hashIdx > 0 ? hashIdx : sel.length;
    const dot = dotIdx > 0 ? dotIdx : sel.length;
    const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
    // data.ns 是命名空间（namespace）的意思，判断是否要创建一个带有命名空间的标签，一般情况下是 svg
    const elm = vnode.elm = isDef(data) && isDef(i = (data as VNodeData).ns) ? api.createElementNS(i, tag)
                                                                              : api.createElement(tag);
    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
    if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
    // 执行模块中的 create 钩子函数
    for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
    // 如果 vnode 中有子节点，创建子 vnode 对应的 DOM 元素并追加到 DOM 树上
    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i];
        if (ch != null) {
          api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue));
        }
      }
    } else if (is.primitive(vnode.text)) {
      api.appendChild(elm, api.createTextNode(vnode.text));
    }
    i = (vnode.data as VNodeData).hook; // Reuse variable
    if (isDef(i)) {
      // 执行用户传入的钩子 create
      if (i.create) i.create(emptyNode, vnode);
      // 如果有 insert 钩子函数，就将 vnode 添加到队列中，为后续执行 insert 钩子做准备
      if (i.insert) insertedVnodeQueue.push(vnode);
    }
  } else {
    // 如果选择器为空，创建文本节点
    vnode.elm = api.createTextNode(vnode.text as string);
  }
  // 返回新创建的 DOM
  return vnode.elm;
}
```

## addVnodes & removeVnodes

```ts
function addVnodes(parentElm: Node,
                    before: Node | null,
                    vnodes: Array<VNode>,
                    startIdx: number,
                    endIdx: number,
                    insertedVnodeQueue: VNodeQueue) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    if (ch != null) {
      api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
    }
  }
}

function invokeDestroyHook(vnode: VNode) {
  let i: any, j: number, data = vnode.data;
  if (data !== undefined) {
    // 执行用户设置的 destroy 钩子函数
    if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
    // 调用模块的 destroy 钩子函数
    for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
    // 执行子节点的 destroy 钩子函数
    if (vnode.children !== undefined) {
      for (j = 0; j < vnode.children.length; ++j) {
        i = vnode.children[j];
        if (i != null && typeof i !== "string") {
          invokeDestroyHook(i);
        }
      }
    }
  }
}

function removeVnodes(parentElm: Node,
                      vnodes: Array<VNode>,
                      startIdx: number,
                      endIdx: number): void {
  // 循环数组中从 startIndex 到 endIndex 的所有 vnode
  for (; startIdx <= endIdx; ++startIdx) {
    let i: any, listeners: number, rm: () => void, ch = vnodes[startIdx];
    if (ch != null) {
      // 如果 sel 有值，元素节点
      if (isDef(ch.sel)) {
        // 执行 destroy 钩子函数（会执行所有子节点的 destroy 钩子函数）
        invokeDestroyHook(ch);
        // 记录模块中 remove 钩子函数的个数，为了防止重复的去调用删除节点的方法
        listeners = cbs.remove.length + 1;
        // 高阶函数，创建删除的回调函数
        rm = createRmCb(ch.elm as Node, listeners);
        for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
        // 判断用户是否设置了 remove 钩子函数，如果有则执行
        if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
          i(ch, rm);
        } else {
          // 如果用户没有创建 remove 钩子函数，就直接调用删除元素的方法
          rm();
        }
      } else { // Text node
        // 如果是文本节点，直接调用删除元素的方法
        api.removeChild(parentElm, ch.elm as Node);
      }
    }
  }
}
```

## patchVnode

```ts
function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
  // 第一步：先执行两个钩子函数
  let i: any, hook: any;
  // 首先判断用户是否设置了 prepatch 钩子函数，如果有，执行
  if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
    i(oldVnode, vnode);
  }
  // 获取 oldValue 的 DOM 元素，并赋值给新节点的属性 elm
  const elm = vnode.elm = (oldVnode.elm as Node);
  // 获取新老节点中的子节点
  let oldCh = oldVnode.children;
  let ch = vnode.children;
  // 判断新老节点的地址是否是相同的，如果相同说明节点没有发生变化，直接返回
  if (oldVnode === vnode) return;
  if (vnode.data !== undefined) {
    // 执行模块的 update 钩子函数
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    i = vnode.data.hook;
    // 执行用户设置的 update 钩子函数
    if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
  }
  // 第二步：对比两个 vnode
  // 如果 vnode.text 未定义
  if (isUndef(vnode.text)) {
    // 如果新老节点都有 children 
    if (isDef(oldCh) && isDef(ch)) {
      // 如果新老节点的 children 不相同，使用 diff 算法对比子节点，更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh as Array<VNode>, ch as Array<VNode>, insertedVnodeQueue);
    } else if (isDef(ch)) {
      // 如果只有新节点有 children
      // 判断老节点中是否有文本内容，如果有，清空
      if (isDef(oldVnode.text)) api.setTextContent(elm, '');
      // 通过 addVnodes 把新节点中增加的子节点添加到页面上
      addVnodes(elm, null, ch as Array<VNode>, 0, (ch as Array<VNode>).length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) {
      // 如果只有老节点有 children
      // 删除老节点的子节点
      removeVnodes(elm, oldCh as Array<VNode>, 0, (oldCh as Array<VNode>).length - 1);
    } else if (isDef(oldVnode.text)) {
      // 如果老节点有 text ，清空 DOM 元素
      api.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {
    // vnode.text 发生了变化
    if (isDef(oldCh)) {
      // 如果老节点中有 children ，移除
      removeVnodes(elm, oldCh as Array<VNode>, 0, (oldCh as Array<VNode>).length - 1);
    }
    // 设置 DOM 元素的 textContent 为 vnode.text
    api.setTextContent(elm, vnode.text as string);
  }
  // 第三步：最后执行用户设置的 postpatch 钩子函数
  if (isDef(hook) && isDef(i = hook.postpatch)) {
    i(oldVnode, vnode);
  }
}
```

## updateChildren

updateChildren 是 diff 算法的核心，对比新旧节点的 children ，更新 DOM。

### 执行过程

- 要对比两棵树的差异，我们可以取第一棵树的每一个节点依次和第二棵树的每一个节点比较，但是这样的事件复杂度为O(n^3)

- 在 DOM 操作的时候我们很少很少会把一个父节点移动/更新到某一个子节点

- 因此只需要找同级别的子节点依次比较，然后再找下一级别的子节点比较，这样算法的事件复杂度为O(n)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712203117390.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70)

- 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点标记索引，遍历的过程中移动索引

- 在对开始和结束节点比较的时候，总共有四种情况

  - oldStartVnode / newStartVnode(旧开始节点 / 新开始节点)
  - oldEndVnode / newEndVnode(旧结束节点 / 新结束节点)
  - oldStartVnode / newEndVnode(旧开始节点 / 新结束节点)
  - oldEndVnode / newStartVnode(旧结束节点 / 新开始节点)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712203625716.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70)

- 开始节点和结束节点的比较，这两种情况类似

  - oldStartVnode / newStartVnode(旧开始节点 / 新开始节点)
  - oldEndVnode / newEndVnode(旧结束节点 / 新结束节点)

- 如果 oldStartVnode 和 newStartVnode 是 sameVnode（key 和 sel相同）

  - 调用 patchVnode() 对比和更新节点
  - 把旧开始和新开始索引往后移动 oldStartIdx++ / oldEndIdx++

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712204225474.png)

- 如果 oldStartVnode 和 newEndVnode 是 sameVnode（key 和 sel相同）

  - 调用 patchVnode() 对比和更新节点
  - 把 oldStartVnode 对应的 DOM 元素，移到右边
  - 更新索引

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712204905331.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70)

- oldEndVnode / newStartVnode (旧结束节点 / 新开始节点)相同

  - 调用 patchVnode() 对比和更新节点
  - 把 oldEndVnode 对应的 DOM 元素，移到左边
  - 更新索引

- 如果不是以上四种情况

  - 遍历新节点，使用 newStartVnode 的 key 在老节点数组中找相同节点
  - 如果没有找到，说明 newStartVnode 是新节点
    - 创建新节点对应的 DOM 元素，插入到 DOM 树中
  - 如果找到了
    - 判断节点和找到的老节点的 sel 选择器是否相同
    - 如果不相同，说明节点修改了
      - 重新创建对应的 DOM 元素，插到 DOM 树种
    - 如果相同，把elmToMove 对应的 DOM 元素，移动到左边

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020071221050315.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70)

- 循环结束

  - 当老节点的所有子节点先遍历完(oldStartIdx > oldEndIdx)，循环结束
  - 新节点的所有子节点先遍历完(newStartIdx > newEndIdx)，循环结束

- 如果老节点的数组先遍历完(oldStartIdx > oldEndIdx)，说明新节点有剩余，把剩余节点批量插入到右边。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712211047805.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70)

- 如果新节点的数组先遍历完(newStartIdx > newEndIdx)，说明老节点有剩余，把剩余节点批量删除。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200712211324200.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Zhbmd4dWFuMTUwOQ==,size_1,color_FFFFFF,t_70)

```ts
function updateChildren(parentElm: Node,
                        oldCh: Array<VNode>,
                        newCh: Array<VNode>,
                        insertedVnodeQueue: VNodeQueue) {
  let oldStartIdx = 0, newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx: any;
  let idxInOld: number;
  let elmToMove: VNode;
  let before: any;
  
  // 循环对比新节点数组中的元素
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 索引变化后，可能会把节点设置为空
    if (oldStartVnode == null) {
      // 节点为空，移动索引
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    // 比较开始和结束节点的四种情况
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 1. 比较老开始节点和新开始节点，然后更新 DOM
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      // 移动索引指向下一个节点
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 2. 比较老结束节点和新结束节点，然后更新 DOM
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      // 更新索引
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      // 3. 比较老开始节点和新结束节点，然后更新 DOM
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      api.insertBefore(parentElm, oldStartVnode.elm as Node, api.nextSibling(oldEndVnode.elm as Node));
      // 更新索引
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      // 4. 比较老结束节点和新开始节点
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      api.insertBefore(parentElm, oldEndVnode.elm as Node, oldStartVnode.elm as Node);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 开始节点和结束节点都不相同
      // 使用 newStartNode 的 key 在老节点数组中找相同节点
      if (oldKeyToIdx === undefined) {
        // 先设置记录 key 和 index 的对象
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      // 遍历 newStartVnode ，从老节点中找相同 key 的 oldVnode 的索引
      idxInOld = oldKeyToIdx[newStartVnode.key as string];
      // 如果是新的 Node
      if (isUndef(idxInOld)) { // New element
        // 如果没找到，newStartNode 是新节点
        // 创建元素插入 DOM 树
        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
        // 重新给 newStartVnode 赋值，指向下一个新节点
        newStartVnode = newCh[++newStartIdx];
      } else {
        // 如果找到 key 相同的老节点，记录到 elemToMove 遍历
        elmToMove = oldCh[idxInOld];
        // 比较老节点的 sel 属性是否和新的开始节点的 sel 属性相同
        if (elmToMove.sel !== newStartVnode.sel) {
          // 如果新旧节点的选择器不同
          // 创建新开始节点对应的 DOM 元素，插入到 DOM 树中
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
        } else {
          // 如果相同，patchVnode()
          // 把 elmToMove 对应的 DOM 元素，移到左边
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined as any;
          api.insertBefore(parentElm, (elmToMove.elm as Node), oldStartVnode.elm as Node);
        }
        // 重新给 newStartVnode 赋值，指向下一个节点
        newStartVnode = newCh[++newStartIdx];
      }
    }
  }
  // 循环结束，老节点数组先遍历完成或者新节点数组先遍历完成
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      // 如果老节点数组先遍历完成，说明新的节点剩余
      // 把剩余的节点都插入到右边
      before = newCh[newEndIdx+1] == null ? null : newCh[newEndIdx+1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else {
      // 如果新节点数组先遍历完成，说明老节点数组有剩余
      // 把剩余老节点删除
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
}
```