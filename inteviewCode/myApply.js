// Function.prototype.myApply = function (context) {
//   context.fn = this
//   context.fn()
//   delete context.fn
// }

// var obj = {
//   name: 'giao',
//   say: function () {
//     console.log(`hello ${this.name}`)
//   }
// }

// var rookie = {
//   name: 'xiaodong'
// }

// obj.say.myApply(rookie)

Function.prototype.maApply = function (context) {
  const context = context || window
  const [thisArg, args] = arguments
  const fn = new Symbol()
  context[fn] = this
  const result = context.fn(...args)
  delete context[fn]
  return result
}