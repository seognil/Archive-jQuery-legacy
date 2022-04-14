function iThrow(options) {
  var setting = $.extend({
    thing: undefined,
    from: undefined,
    to: undefined,
    duration: 300,
    angel: 2,
    size: "100%", // %,px,rem / "50% 30%"
    opacity: "1 0.3", // "0.3 0.2"

    callback: function () {
      console.log("done");
    }, // 回调函数
  }, options)
  var dom = {}
  var style = {
    size: [],
    opacity: [],
  }
  var anime = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
    distance: {
      x: 0,
      y: 0,
    },
    delta: {
      x: 0,
      y: 0,
    },
    step: 0,
    count: 0,
    duration: 0,
    angel: 2,
  }
  var animePlay = function () {
    var tracker = window.requestAnimationFrame(animePlay);
    dom.$thing.css({
      "left": throwMoveX(anime.start.x, anime.distance.x, anime.step, anime.count) + "px",
      "top": throwMoveY(anime.start.y, anime.distance.y, anime.step, anime.count, anime.angel) + "px",
      "opacity": throwOpacity(style.opacity[0], style.opacity[1], anime.step, anime.count)
    })
    anime.count += 1

    if (anime.count > anime.step) {
      window.cancelAnimationFrame(tracker);
      animeDone()
      console.log(anime.count, anime.step)
    }
  }

  function throwMoveX(s0, s, t, i) {
    return s0 + i * s / t
  }

  function throwMoveY(s0, s, t, i, k) {
    k = k * s / t * 2 / (t - 1)
    return s0 + s * i / t + (i - t) * i / 2 * k
  }

  function throwOpacity(s0, s1, t, i) {
    return s0 + (s1 - s0) / t * i
  }

  function throwSrart() {
    initData()

  }
  throwSrart()

  function initData() {
    initStyle()
    initDom()
    initAnimeStart()
  }

  function initStyle() {
    style.size = setting.size.split(" ")
    style.size[1] = style.size[1] || style.size[0]
    if (style.size[0].slice(-1) == "%") {
      style.size[0] = style.size[0].slice(0, -1) / 100
    } else if (style.size[0].slice(-2) == "px") {
      style.size[0] = style.size[0].slice(0, -2) / $(setting.thing).outerWidth()
    }
    if (style.size[1].slice(-1) == "%") {
      style.size[1] = style.size[1].slice(0, -1) / 100
    } else if (style.size[1].slice(-2) == "px") {
      style.size[1] = style.size[1].slice(0, -2) / $(setting.thing).outerHeight()
    }
    style.opacity = setting.opacity.split(" ")
    style.opacity[0] = Number(style.opacity[0])
    style.opacity[1] = Number(style.opacity[1]) || style.opacity[0]
  }

  function initDom() {
    dom.$thing = $(setting.thing).clone().removeClass().addClass("throwThing")
    dom.$thing[0].style.cssText = window.getComputedStyle($(setting.thing)[0], null).cssText
    dom.$thing.css({
      "transform": "scale(" + style.size.join(",") + ")",
      "opacity": style.opacity[0],
      "z-index": 999999,
      // "background-color": "hsl(220, 100%, 60%)",
      "pointer-events": "none"
    })
  }

  function initAnimeStart() {
    anime.duration = setting.duration
    anime.angel = setting.angel
    anime.start.x = $(setting.from).offset().left + $(setting.from).outerWidth() / 2
    anime.start.y = $(setting.from).offset().top + $(setting.from).outerHeight() / 2
    anime.end.x = $(setting.to).offset().left + $(setting.to).outerWidth() / 2
    anime.end.y = $(setting.to).offset().top + $(setting.to).outerHeight() / 2
    anime.distance.x = anime.end.x - anime.start.x
    anime.distance.y = anime.end.y - anime.start.y
    dom.$thing.css({
      "position": "absolute",
      "left": anime.start.x + "px",
      "top": anime.start.y + "px",
      "transform": "matrix(" + [style.size[0], 0, 0, style.size[1], (dom.$thing.outerWidth() / -2), (dom.$thing.outerHeight() / -2)].join(",") + ")",
    }).appendTo("body")
    anime.step = Math.round(anime.duration / 1000 * 60)
    anime.count = 0
    animePlay()
  }

  function animeDone() {
    dom.$thing.remove()
  }

  function looper(n, fn) {
    if (!(n instanceof Array)) {
      n = [0, n - 1]
    }
    for (var i = n[0]; i <= n[1]; i++) {
      fn(i)
    }
  }
}