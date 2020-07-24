const PENDING = 'pending'
const RESOLOVE = 'resolve'
const REJECTED = 'rejected'

/**
 * 实现要点：
 * 1. 回调函数延迟绑定
 * 2. 回调返回值穿透
 * 3. 错误冒泡
 * @param {*} callback 
 */
function Promise1(callback) {
  const self = this

  self.status = PENDING // Promise当前的状态
  self.data = undefined // Promise的值
  self.onResolvedCallback = [] // Promise resolve时的回调函数集
  self.onRejectedCallback = [] // Promise reject时的回调函数集

  function resolve(value) {
    if (self.status === PENDING) {
      self.status = RESOLOVE
      self.data = value
      for (let i = 0; i < self.onRejectedCallback.length; i++) {
        self.onResolvedCallback[i](value)
      }
    }
  }

  function reject(error) {
    if (self.status === PENDING) {
      self.status = REJECTED
      self.data = error

      //如果没有错误函数，需要把错误输出到控制台
      if (self.onRejectedCallback.length === 0) {
        console.error(error)
      }

      for (let i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](error)
      }
    }
  }

  // 考虑到执行executor的过程中可能出错，所以我们用try/catch块包起来
  try {
    callback(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 循环调用
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  if (x instanceof Promise1) {
    if (x.status === PENDING) { // 如果x的状态还没有确定
      x.then((value) => { resolvePromise(promise2, value, resolve, reject) })
    } else {
      x.then(resolve, reject) // 但如果这个promise的状态已经确定了，那么它肯定有一个""正常的值"，所以这里直接取它的状态
    }
    return
  }

  //  确保不同的 Promise 可以调用
  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      const { then } = x
      let thenCalledOrThrow = false // reject 或者 resolve 其中一个执行过得话，忽略其他的

      // 如果 then 是函数，调用 x.then
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true

          return resolvePromise(promise2, y, resolve, reject)
        }, (r) => {
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
  let promise2 = null

  // 按照标准，如果then的参数不是Function，则我们需要忽略它，并把值往后传递
  onResolved = typeof onResolved === 'function' ? onResolved : function (v) { return value }
  onRejected = typeof onRejected === 'function' ? onRejected : function (r) { return value }

  const generatePromise = (callback) => {
    promise2 = Promise1((resolve, reject) => {
      // 异步执行 callback 
      setTimeout(() => {
        try {
          const x = callback(this.data)

          resolvePromise(promise2, x, resolve, reject) // 根据x的值决定promise2的状态的函数
        } catch (e) {
          reject(e) // 如果出错，以捕获到的错误做为promise2的结果
        }
      })
    })
  }

  // 如果promise1的状态已经确定并且是resolved，我们调用onResolved
  // 因为考虑到有可能throw，所以我们将其包在try/catch块里
  if (this.status === Resolve) {
    generatePromise(onResolove)
    return promise2
  }

  if (this.status === REJECTED) {
    generatePromise(onRejected)
    return promise2
  }

  // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected,只能等到Promise的状态确定后，才能确实如何处理
  // 所以我们需要把我们的两种情况的处理逻辑做为callback放入promise1
  // 逻辑本身跟第一个if块内的几乎一致
  if (this.status === PENDING) {
    return promise2 = new Promise1((resolve, reject) => {
      this.onResolvedCallback.push((value) => {
        try {
          const x = onResolved(value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })

      this.onRejectedCallback.push((error) => {
        try {
          const x = onRejected(error)
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

Promise1.prototype.finally = function (callback) {
  this.then(value => {
    return Promise1.resolve(callback()).then(() => {
      return value;
    })
  }, error => {
    return Promise1.resolve(callback()).then(() => {
      throw error;
    })
  })
}

Promise1.resolve = function (value) {
  return new Promise1((resolve, reject) => {
    resolvePromise(promise, value, resolve, reject)
  })
}

Promise1.reject = function (reason) {
  return new Promise1((resolve, reject) => {
    reject(reason)
  })
}

Promise1.all = function (promises) {
  return new Promise1(function (resolve, reject) {
    let resolvedCounter = 0
    const promiseNum = promises.length
    const resolvedValues = new Array(promiseNum)

    for (let i = 0; i < promiseNum; i++) {
      Promise1.resolve(promises[i]).then((value) => {
        resolvedCounter++
        resolvedValues[i] = value

        if (resolvedCounter === promiseNum) {
          return resolve(resolvedValues)
        }

      }, (reason) => reject(reason))
    }
  })
}

Promise1.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      Promise1.resolve(promises[i]).then(
        (value) => resolve(value),
        (reason) => reject(reason))
    }
  })
}

