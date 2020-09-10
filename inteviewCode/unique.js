Array.prototype.unique = function () {
  return [...new Set(this)]
}

// Array.prototype.unique = function () {
//   var isExit = true
//   var resultArr = []
//   for (let i = 0; i < this.length; i++) {
//     isExit = false
//     for (let j = 0; j < resultArr.length; j++) {
//       if (this[i] === resultArr[j]) {
//         isExit = true
//       }
//     }
//     if (!isExit) {
//       resultArr.push(this[i])
//     }
//   }
//   return resultArr
// }

Array.prototype.unique = function () {
  return this.filter((item, index) => {
    return this.indexOf(item) === index
  })
}

let arr = [1, 2, 3, 4, 5, 3, 2, 1, 3, 3, 4, 5, 6, 7, 8, 9, 0, 7, 6, 9]
console.log(arr.unique())