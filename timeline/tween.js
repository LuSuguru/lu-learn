/*
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * Get effect on 'http://easings.net/zh-cn'
 */

const Tween = {
  linear: function (t, b, c, d) {
    return c * t / d + b;
  },
  // Quad
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOut: function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOut: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  // Cubic
  easeInCubic: function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  // Quart
  easeInQuart: function (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart: function (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },
  // Quint
  easeInQuint: function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  // Sine
  easeInSine: function (t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  easeOutSine: function (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  easeInOutSine: function (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  // Expo
  easeInExpo: function (t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo: function (t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOutExpo: function (t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  // Circ
  easeInCirc: function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc: function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  // Elastic
  easeInElastic: function (t, b, c, d, a, p) {
    let s;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (typeof p == "undefined") p = d * .3;
    if (!a || a < Math.abs(c)) {
      s = p / 4;
      a = c;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  easeOutElastic: function (t, b, c, d, a, p) {
    let s;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (typeof p == "undefined") p = d * .3;
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
  },
  easeInOutElastic: function (t, b, c, d, a, p) {
    let s;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (typeof p == "undefined") p = d * (.3 * 1.5);
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  },
  // Back
  easeInBack: function (t, b, c, d, s) {
    if (typeof s == "undefined") s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack: function (t, b, c, d, s) {
    if (typeof s == "undefined") s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack: function (t, b, c, d, s) {
    if (typeof s == "undefined") s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  // Bounce
  easeInBounce: function (t, b, c, d) {
    return c - Tween.easeOutBounce(d - t, 0, c, d) + b;
  },
  easeOutBounce: function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  },
  easeInOutBounce: function (t, b, c, d) {
    if (t < d / 2) {
      return Tween.easeInBounce(t * 2, 0, c, d) * .5 + b;
    } else {
      return Tween.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
  }
};
