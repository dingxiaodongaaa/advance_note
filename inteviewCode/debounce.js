// 函数防抖
function debounce (fn, delay) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}

// 函数节流
function throttle (fn, delay) {
  let prev = Date.now()
  return function () {
    let now = Date.now()
    if (now - prev > delay) {
      fn()
      prev = Date.now()
    }
  }
}