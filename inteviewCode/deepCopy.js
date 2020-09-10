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

// function cloneLoop(x) {
//   const root = {};

//   // 栈
//   const loopList = [
//       {
//           parent: root,
//           key: undefined,
//           data: x,
//       }
//   ];

//   while(loopList.length) {
//       // 深度优先
//       const node = loopList.pop();
//       const parent = node.parent;
//       const key = node.key;
//       const data = node.data;

//       // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
//       let res = parent;
//       if (typeof key !== 'undefined') {
//           res = parent[key] = {};
//       }

//       for(let k in data) {
//           if (data.hasOwnProperty(k)) {
//               if (typeof data[k] === 'object') {
//                   // 下一次循环
//                   loopList.push({
//                       parent: res,
//                       key: k,
//                       data: data[k],
//                   });
//               } else {
//                   res[k] = data[k];
//               }
//           }
//       }
//   }

//   return root;
// }

const originObj = {a:'a',b:'b',c:[1,2,3],d:{dd:'dd'}};
const cloneObj = deepCopy (originObj);
console.log(cloneObj === originObj); // false
console.log(originObj)
console.log(cloneObj)
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

