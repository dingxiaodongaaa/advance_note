function deepCopy (data) {
  const resultData = Array.isArray(data) ? [] : {}
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] && typeof data[key] === 'object') {
        resultData[key] = deepCopy(data[key])
      } else {
        resultData[key] = data[key]
      }
    }
  }
  return resultData
}

// const originObj = {a:'a',b:'b',c:[1,2,3],d:{dd:'dd'}};
// const cloneObj = deepCopy(originObj);
// console.log(cloneObj === originObj); // false
// originObj.c[0] = 999
// console.log(originObj.c[0])
// console.log(cloneObj.c[0])

// const originObj = {
//   name:'axuebin',
//   sayHello:function(){
//     console.log('Hello World');
//   }
// }
// console.log(originObj); // {name: "axuebin", sayHello: ƒ}
// const cloneObj = deepCopy(originObj);
// console.log(cloneObj); // {name: "axuebin", sayHello: ƒ}
// console.log(originObj === cloneObj)

async function async1 () {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2 () {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
})

async1()

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')