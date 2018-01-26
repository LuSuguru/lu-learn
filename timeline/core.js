function Core(opt) {
  this.state = 'init'

  this.duration = opt.duration || 1000
  this.timingFunction = opt.timingFunction || 'linear'
  this.renderFunction = opt.render || this._defaultFunc

  this.onPlay = opt.onPlay
  this.onEnd = opt.onEnd
  this.onStop = opt.onStop
  this.onReset = opt.onReset

  this.value = []
  opt.value.forEach(item => {
    this.value.push({
      start: parseFloat(item[0]),
      end: parseFloat(item[1])
    })
  })
}

Core.prototype._loop = function () {

  const t = Date.now() - this.beginTime,
    d = this.duration,
    func = Tween[this.timingFunction || Tween['linear']]

  if (t >= d) {
    this.state = 'end'
    this._renderFunction(t, d, func)
  } else {
    this._renderFunction(t, d, func)
    window.requestAnimationFrame(this._loop.bind(this))
  }
}

Core.prototype._renderFunction = function (t, d, func) {
  const values = this.value.map(value => func(t, value.start, value.end - value.start, d))
  this.renderFunction.apply(this, values)
}

Core.prototype.play = function () {
  this.state = 'play'
  this.beginTime = Date.now()

  const loop = this._loop.bind(this)
  window.requestAnimationFrame(loop)
}