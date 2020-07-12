# Snabbdom Modules 源码

- patch() -> patchVnode() -> updateChildren()

  - patch() 函数中所作的任务就是，对比两个虚拟节点，找到差异进行 DOM 操作。
  - patch() 中的所有 DOM 操作：创建 DOM 元素，移除 DOM 元素，更新 DOM 内的子节点以及文本内容。

- Snabbdom 为了保证核心库的精简，把处理元素的属性/事件/样式等工作，放置到模块中。
- 模块可以按照需要引入
- 模块的使用可以查看官方文档
- 模块实现的核心是基于 Hooks

**Hooks**

  - hooks.ts 文件中定义了 Snabbdom 中所有的钩子函数

```ts
import {VNode} from './vnode';

// 规定钩子函数的参数类型和返回值类型
export type PreHook = () => any;
export type InitHook = (vNode: VNode) => any;
export type CreateHook = (emptyVNode: VNode, vNode: VNode) => any;
export type InsertHook = (vNode: VNode) => any;
export type PrePatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type UpdateHook = (oldVNode: VNode, vNode: VNode) => any;
export type PostPatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type DestroyHook = (vNode: VNode) => any;
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => any;
export type PostHook = () => any;

// 接口，定义了钩子函数所需要的所有的钩子函数的名称以及对应的类型。
export interface Hooks {
  // patch 函数开始执行的时候触发
  pre?: PreHook;
  // createElm 函数开始之前的时候触发
  // 在把 VNode 转换成真实 DOM 之前触发
  init?: InitHook;
  // createElm 函数末尾调用
  // 创建完真实 DOM 后触发
  create?: CreateHook;
  // patch 函数末尾执行
  // 真实 DOM 添加到 DOM 树中触发
  insert?: InsertHook;
  // patchVnode 函数开头调用
  // 开始对比两个 VNode 的差异之前触发
  prepatch?: PrePatchHook;
  // patchVnode 函数开头调用
  // 两个 VNode 对比过程中触发，比 prepatch 稍晚
  update?: UpdateHook;
  // patchVnode 的最末尾调用
  // 两个 VNode 对比结束执行
  postpatch?: PostPatchHook;
  // removeVnodes -> invokeDestroyHook 中调用
  // 在删除元素之前触发，子节点的 destroy 也被触发
  destroy?: DestroyHook;
  // removeVnodes 中调用
  // 元素被删除的时候触发
  remove?: RemoveHook;
  post?: PostHook;
}
```


```ts
import {VNode, VNodeData} from '../vnode';
import {Module} from './module';

// because those in TypeScript are too restrictive: https://github.com/Microsoft/TSJS-lib-generator/pull/237
declare global {
  interface Element {
    setAttribute(name: string, value: string | number | boolean): void;
    setAttributeNS(namespaceURI: string, qualifiedName: string, value: string | number | boolean): void;
  }
}

export type Attrs = Record<string, string | number | boolean>

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58;
const xChar = 120;

function updateAttrs(oldVnode: VNode, vnode: VNode): void {
  var key: string, elm: Element = vnode.elm as Element,
      oldAttrs = (oldVnode.data as VNodeData).attrs,
      attrs = (vnode.data as VNodeData).attrs;

  // 新老节点没有 attrs 属性，返回
  if (!oldAttrs && !attrs) return;
  // 新老节点的 attrs 属性相同，返回
  if (oldAttrs === attrs) return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  // 遍历新节点的所有属性获得新老节点对应的属性值
  // update modified attributes, add new attributes
  for (key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];
    // 判断，如果新老节点的属性值不同
    if (old !== cur) {
      // 布尔类型值的处理
      if (cur === true) {
        elm.setAttribute(key, "");
      } else if (cur === false) {
        elm.removeAttribute(key);
      } else {
        // xChar -> x
        // <svg xmlns='http://www.w3.org/2000/svg'>
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur);
        } else if (key.charCodeAt(3) === colonChar) {
          // colonChar -> :
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur);
        } else if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          // <svg xmlns='http://www.w3.org/1999/xlink'>
          elm.setAttributeNS(xlinkNS, key, cur);
        } else {
          elm.setAttribute(key, cur);
        }
      }
    }
  }
  // remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  // 如果老节点的属性在新节点中不存在，移除
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

export const attributesModule = {create: updateAttrs, update: updateAttrs} as Module;
export default attributesModule;
```