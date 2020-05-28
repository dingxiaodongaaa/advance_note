// 将给定对象包装为 `Proxy` 实现数据响应
function reactive (obj) {
    const dep = {}
    return new Proxy (obj, {
        get (target, property) {
            dep[property] = dep[property] || watch.effect
            return Reflect.get(target, property)
        },
        set (target, property, value) {
            Reflect.set(target, property, value)
            dep[property] && dep[property]()
        }
    })
}

// 添加一个数据状态监视函数
function watch (effect) {
    watch.effect = effect
    effect()
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