### 使用 ts 创建 vue 组件的三种方式

1. Options APIs

```js
import Vue form 'vue'

export default vue.extend({
  data () {
    return {
      count: 0
    }
  },

  methods: {
    increment () {
      this.count++
    },

    decrement () {
      this.count--
    }
  }
})
```

2. Class APIs

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Componet
export default class App extends Vue {
  count = 0

  increment () {
    this.count++
  }

  decrement () {
    this.count--
  }
}
```

3. Class APIs + decorator

```js
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  @Prop(Number) readonly propA: number | undefined
  @Prop({ default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined
}
```

*建议：*不要使用 Class APIs ，使用 Options APIs

> Class 语法仅仅是一种写法而已，最终还是要转换为普通的组件数据结构
> 装饰器语法还没有正式定稿，建议了解即可，正式定稿之后再选择使用也可以

使用 Options APIs 最好是使用 `export default Vue.extend({ ... })` 而不是使用 `export default { ... }`，前者可以对 ts 类型有更好的支持。