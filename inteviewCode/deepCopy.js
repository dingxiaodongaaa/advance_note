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

const _toString = Object.prototype.toString

function deepCopy (data) {
  const resultData = Array.isArray(data) ? [] : {}
  for(key in data) {
    if(data.hasOwnProperty(key)) {
      if(data[key] && typeof data[key] === 'object') {
        resultData[key] = deepCopy(data[key])
      } else {
        resultData[key] = data[key]
      }
    }
  }
  return resultData
}