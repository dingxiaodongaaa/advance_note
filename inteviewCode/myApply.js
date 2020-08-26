Function.prototype.myApply = function (context) {
  var context = context || window
  const args = arguments[1]
  const fn = Symbol()
  context[fn] = this
  let result
  if (args && args.length) {
    result = context[fn](...args)
  } else {
    result = context[fn]()
  }
  delete context[fn]
  return result
}

Function.prototype.myCall = function (context) {
  var [context, ...args] = arguments
  context = context || window
  const fn = Symbol()
  context[fn] = this
  let result
  if (args && args.length) {
    result = context[fn](...args)
  } else {
    result = context[fn]()
  }
  return result
}

var obj = {
  name: 'giao',
  say: function () {
    console.log(`hello ${this.name}`)
  }
}

var rookie = {
  name: 'xiaodong'
}

obj.say.myCall(rookie)
