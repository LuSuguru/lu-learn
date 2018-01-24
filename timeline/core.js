import Tween from './tween'

class Core {
  constructor(opt) {
    this._init(opt)
    this.state = 'init'
  }

  _init(opt) {
    this._initValue(opt.value)
    // 保存动画总时长，缓动函数以及渲染函数
    this.duration = opt.duration || 1000
    this.timingFunction = opt.timingFunction || 'linear'
    this.renderFunction = opt.render || this._defaultFunc

    // 未来会用到的事件函数
    this.onPlay = opt.onPlay
    this.onEnd = opt.onEnd
    this.onStop = opt.onStop
    this.onReset = opt.onReset
  }

  _initValue(value) {
    // 初始化运动值
    this.value = []
    value.forEach(item => {
      this.value.push({
        start: parseFloat(item[0]),
        end: parseFloat(item[1])
      })
    })
  }

  _loop() {
    const t = Date.now() - this.beginTime,
      d = this.duration,
      func = Tween[this.timingFunction] || Tween['linear']

    if (t >= d) {
      this.state = 'end'
      this._renderFunction(t, d, func)
    } else {
      this._renderFunction(t, d, func)
      window.requestAnimationFrame(this._loop.bind(this))
    }
  }

  _renderFunction(t, d, func) {
    const values = this.value.map(value => func(t, value, value.end - value.start, d))
    this.renderFunction.apply(this, values)
  }

  _play() {
    this.state = 'play'
    this.beginTime = Date.now()
    // 执行动画循环
    const loop = this._loop.bind(this)
    window.requestAnimationFrame(loop)
  }

  play() {
    this._play()
  }
}

export default Core