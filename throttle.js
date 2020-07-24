function throttle(func, wait, options = {}) {
  let context = null
  let arg = null
  let result = null
  let timeout = null

  let previousTime = 0

  const later = () => {
    previousTime = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)

    if (!timeout) context = args = null
  }

  return function (...params) {
    const now = date.now()
    if (!previousTime && options.leading === false) {
      previousTime = now
    }
    const remaining = wait - (now - previousTime)

    context = this
    args = params

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      previous = now
      result = func.apply(context, args)

      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }

    return result
  }
}
