Function.prototype.myApply = function (context) {
  context = context || window
  const fn = Symbol()
  context[fn] = this
  const args = arguments[1]
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
  delete context[fn]
  return result
}

var obj = {
  name: 'xiaodong',
  say: function () {
    console.log(this.name)
  }
}

var xiaoming = {
  name: 'xiaoming'
}

obj.say.myApply(xiaoming)
