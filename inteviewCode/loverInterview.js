//************************************************************first */
// const man = {
//   name: 'jscoder',
//   age: 22
// }
// const proxy = new Proxy(man, {
//   get (target, property) {
//     if (target.hasOwnProperty(property)) {
//       return Reflect.get(target, property)
//     } else {
//       throw `Property "$(${property})" does not exist`
//     }
//   }
// })
// proxy.name // 'jscoder'
// proxy.age // 22
// proxy.location // property "$(property)" does not exist

//************************************************************second */

// function red(){
//   console.log('red');
// }
// function green(){
//   console.log('green');
// }
// function yellow(){
//   console.log('yellow');
// }

// function timeout (ms, cb) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       cb()
//       resolve()
//     }, ms)
//   })
// }

// const loop = () => {
//   Promise.resolve().then(() => {
//     return timeout(3000, red)
//   }).then(() => {
//     return timeout(1000, green)
//   }).then(() => {
//     return timeout(2000, yellow)
//   }).then(() => {
//     loop()
//   })
// }

// loop()

//************************************************************third */

var User = {
  count: 1,
  action: {
    getCount: function () {
      return this.count
    }
  }
}
var getCount = User.action.getCount;
setTimeout(() => {
  console.log("result 1", User.action.getCount())
})
console.log("result 2", getCount())