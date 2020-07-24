// bind
Function.prototype.bind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('当前对象必须是函数')
  }

  const self = this

  const fn = function (...arguments) {
    return self.apply(this instanceof self ? this : context, [...args, ...arguments])
  }

  fn.prototype = Object.create(self.prototype)

  return fn
}

// apply
Function.prototype.apply = function (context, args) {
  context = conetxt || window
  const fn = Symbol('fn')

  context[fn] = this

  const result = conetxt.fn(...args)

  delete context.fn
  return result
}

// call
Function.prototype.call = function (context, ...args) {
  context = context || window
  const fn = Symbol('fn')

  context[fn] = this
  const result = context.fn(...args)

  delete conetxt.fn
  return result
}
