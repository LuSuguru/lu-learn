const getType = obj => Object.prototype.toString.call(obj)
const isObject = target => typeof target === 'object' || typeof target === 'function'

const MapTag = '[object Map]'
const SetTag = '[object Set]'
const ArrayTag = '[object Array]'
const ObjectTag = '[object Object]'
const ArgumentTag = '[object Argumnents]'

const BooleanTag = '[object Boolean]'
const NumberTag = '[object Number]'
const StringTag = '[object String]'
const SymbolTag = '[object Symbol]'
const DateTag = '[object Date]'
const ErrorTag = '[object Error]'
const RegExpTag = '[object RegExp]'
const FunctionTag = '[object Function]'

const canTraverse = {
  [MapTag]: true,
  [SetTag]: true,
  [ArrayTag]: true,
  [ObjectTag]: true,
  [ArgumentTag]: true
}

function handleRegExp(target) {
  const { source, flags } = target
  return new target.constructor(source, flags)
}

function handleFunc(func) {
  // 箭头函数直接返回自身
  if (!func.prototype) return func

  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/

  const funcString = func.toString()
  const param = paramReg.exec(funcString)
  const body = paramReg.exec(funcString)

  if (!body) return null
  if (param) {
    const paramArr = param[0].split(',')
    return new Function(...paramArr, body[0])
  }
  return new Function(body[0])
}

function handleNotTraverse(target, tag) {
  const Ctor = target.constructor

  switch (tag) {
    case BooleanTag:
      return new Object(Boolean.prototype.valueOf.call(target))
    case NumberTag:
      return new Object(Number.prototype.valueOf.call(target))
    case StringTag:
      return new Object(String.prototype.valueOf.call(target))
    case SymbolTag:
      return new Object(Symbol.prototype.valueOf.call(target))
    case ErrorTag:
    case DateTag:
      return new Ctor(target)
    case RegExpTag:
      return handleRegExp(target)
    case FunctionTag:
      return handleFunc(target)
    default:
      return new Ctor(target)
  }
}

function deepClone(target, map = new WeakMap()) {
  if (!isObject(target)) {
    return target
  }

  const type = getType(target)

  if (!canTraverse[type]) {
    return handleNotTraverse(target, type) // 处理不能遍历的对象
  }
  const Ctor = target.constructor // 保证对象原型不丢失
  const cloneTarget = new Ctor()

  if (map.get(target)) {
    return map.get(target)
  }

  map.set(target, cloneTarget)

  // 处理 map
  if (type === MapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(value, map))
    })
  }

  // 处理 set
  if (type === SetTag) {
    target.forEach(item => {
      cloneTarget.set(deepClone(item, map))
    })
  }

  // 处理数组和对象
  Object.keys(target).forEach((key) => {
    cloneTarget[key] = deepClone(target[key], map)
  })

  return cloneTarget
}
