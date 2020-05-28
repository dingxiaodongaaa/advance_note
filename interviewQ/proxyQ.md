## 20200520面试题

```
// 将给定对象包装为 `Proxy` 实现数据响应
function reactive (obj) {
    // ... 内部实现
}

// 添加一个数据状态监视函数
function watch (effect) {
    // ... 内部实现
}

const state = reactive({
    foo: 100,
    bar: 200
})

watch(() => {
    console.log('foo changed:', state.foo)
})

watch(() => {
    console.log('bar changed:', state.bar)
})

state.foo ++ // foo changed: 101
state.bar ++ // foo changed: 201
```

假设现有`reactive`和`watch`这两个函数，最终效果是state.foo或state.bar的值一旦改变，对应的watch函数自动执行。

例如：

- state.foo的值改变，执行第一个watch中的回调函数
- state.bar的值改变，执行第二个watch中的回调函数

要求：实现这个reactive和watch这两个函数

思路：

1. 利用proxy实现数据响应
2. reactive函数将给定对象包装成为Proxy实现数据响应
3. watch函数的作用是添加一个数据状态监视函数，只有这个函数内使用的成员发生变化时，这个函数才会被执行

难点：

1. 如何收集属性对应的依赖函数
