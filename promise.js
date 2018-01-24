function Promise1(fn) {
  var state = 'pending',
    value = null,
    deferreds = []

  this.then = function (onFulfilled) {
    if (state === 'pending') {
      deferreds.push(onFulfilled)
      return this
    }
    onFulfilled(value)
    return this
  }

  function resolve(newValue) {
    value = newValue
    state = 'fulfilled'
    
    setTimeout(function () {
      deferreds.forEach(function (deferred) {
        deferred(value)
      })
    }, 0)
  }
  fn(resolve)
}