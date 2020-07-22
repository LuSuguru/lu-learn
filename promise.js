/**
 * 实现要点：
 * 1. 回调函数延迟绑定
 * 2. 回调返回值穿透
 * 3. 错误冒泡
 * @param {*} executor 
 */
function Promise1(executor) {
  var self = this

  self.status = 'pending' // Promise当前的状态
  self.data = undefined // Promise的值
  self.onResolvedCallback = [] // Promise resolve时的回调函数集
  self.onRejectedCallback = [] // Promise reject时的回调函数集

  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved'
      self.data = value
      for (var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.data = reason

      //如果是最后一个函数，需要把错误输出到控制台
      if (self.onRejectedCallback.length === 0) {
        console.error(reason)
      }

      for (var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason)
      }
    }
  }

  // 考虑到执行executor的过程中可能出错，所以我们用try/catch块包起来
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  var then

  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  var thenCalledOrThrow = false

  // 循环调用
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  if (x instanceof Promise1) {
    // 如果x的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值的
    if (x.status === 'pending') {
      x.then(function (value) {
        resolvePromise(promise2, value, resolve, reject)
      })
    } else {
      // 但如果这个promise的状态已经确定了，那么它肯定有一个""正常的值"，而不是一个thenable，所以这里直接取它的状态
      x.then(resolve, reject)
    }
    return
  }

  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      let then = x.then

      // 如果 then 是函数，调用 x.then
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true

          return resolvePromise(promise2, y, resolve, reject)
        }, function rj(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true

          return reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      
      return reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise1.prototype.then = function (onResolved, onRejected) {
  var self = this
  var promise2

  // 按照标准，如果then的参数不是Function，则我们需要忽略它，并把值往后传递
  onResolved = typeof onResolved === 'function' ? onResolved : function (v) { return value }
  onRejected = typeof onRejected === 'function' ? onRejected : function (r) { return value }


  // 如果promise1(此处即为this/self)的状态已经确定并且是resolved，我们调用onResolved
  // 因为考虑到有可能throw，所以我们将其包在try/catch块里
  if (self.status === 'resolved') {
    return promise2 = new Promise1(function (resolve, reject) {
      setTimeout(() => { //异步执行onResolved
        try {
          var x = onResolved(self.data)
          // 根据x的值决定promise2的状态的函数
          // resolvePromise(promise2, x, resolve, reject)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e) // 如果出错，以捕获到的错误做为promise2的结果
        }
      })
    })
  }

  if (self.status === 'rejected') {
    return promise2 = new Promise1(function (resolve, reject) {
      setTimeout(() => { // 异步执行onRejected
        try {
          var x = onRejected(self.data)
          // 根据x的值决定promise2的状态的函数
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected,只能等到Promise的状态确定后，才能确实如何处理
  // 所以我们需要把我们的两种情况的处理逻辑做为callback放入promise1
  // 逻辑本身跟第一个if块内的几乎一致
  if (self.status === 'pending') {
    return promise2 = new Promise1(function (resolve, reject) {
      self.onResolvedCallback.push(function (value) {
        try {
          var x = onResolved(self.data)
          // 根据x的值决定promise2的状态的函数
          // resolvePromise(promise2, x, resolve, reject)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })

      self.onRejectedCallback.push(function (reason) {
        try {
          var x = onRejected(self.data)
          // 根据x的值决定promise2的状态的函数
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

Promise1.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

Promise.prototype.finally = function (fn) {
  // 为什么这里可以呢，因为所有的then调用是一起的，但是这个then里调用fn又异步了一次，所以它总是最后调用的。
  // 当然这里只能保证在已添加的函数里是最后一次，不过这也是必然。
  // 不过看起来比其它的实现要简单以及容易理解的多。
  // 貌似对finally的行为没有一个公认的定义，所以这个实现目前是跟Q保持一致，会返回一个新的Promise而不是原来那个。
  return this.then(function (v) {
    setTimeout(fn)
    return v
  }, function (r) {
    setTimeout(fn)
    throw r
  })
}

Promise1.resolve = function (value) {
  var promise = new Promise(function (resolve, reject) {
    resolvePromise(promise, value, resolve, reject)
  })
  return promise
}

Promise1.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason)
  })
}

Promise1.all = function (promises) {
  return new Promise(function (resolve, reject) {
    var resolvedCounter = 0
    var promiseNum = promises.length
    var resolvedValues = new Array(promiseNum)

    for (var i = 0; i < promiseNum; i++) {
      (function (i) {
        Promise.resolve(promises[i]).then(function (value) {
          resolvedCounter++
          resolvedValues[i] = value

          if (resolvedCounter === promiseNum) {
            return resolve(resolvedValues)
          }

        }, function (reason) {
          return reject(reason)
        })
      })(i)
    }
  })
}

Promise1.race = function (promises) {
  return new Promise(function (resolve, reject) {
    for (var i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(function (value) {
        return resolve(value)
      }, function (reason) {
        return reject(reason)
      })
    }
  })
}

