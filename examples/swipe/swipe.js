$.fn.iSwipe = function (options) {
  var setting = $.extend({
    "slot": undefined,
    "swipe": undefined,
    "panel-left": undefined,
    "panel-right": undefined,
    "deadZoneRange": 5,
    "event": undefined,
    "able": function () {
      return true
    },
  }, options)

  var touch = {
    start: {
      x: 0,
      y: 0,
      time: 0,
    },
    $slotScroll: 0,
    old: {
      x: 0,
      y: 0
    },
    speed: {},
    speedTracker: undefined,
    frameLooper: undefined,
  }
  var style = {
    $slot: {},
    $swipper: {},
  }

  var dom = {
    $slot: undefined,
    $swipper: undefined,
  }
  var flag = {
    thisStatus: 'none',
    globalStatus: 'none',
    clearTimer: undefined,
    fuckiosTracker: undefined,
    fuckiosTimer: undefined,
  }

  return this.each(function () {
    var $this = $(this)

    iSwipeSuperInit()

    function iSwipeSuperInit() {
      $this.on("touchstart", function (e) {
        if ($(e.target).closest(setting.slot).length) {
          iSwipeRestart(e)
        }
      })
    }

    function iSwipeRestart(e) {
      // e.preventDefault()
      window.cancelAnimationFrame(flag.frameLooper)
      clearInterval(touch.speedTracker)
      clearInterval(flag.fuckiosTracker)
      if (setting.able()) {
        cacheThings(e)
        fixSlotStyle()
        switchTarget(e)
      }
    }

    $("body").on("touchstart", function (e) {
      if (flag.thisStatus != "none") {
        clearThisSwipper()
      }
      // console.log("start", flag.thisStatus, flag.globalStatus)
    })
    $("body").on("touchmove", function (e) {
      // console.log(touch.speed.y)
    })
    $("body").on("touchend", function (e) {
      // console.log("end", flag.thisStatus, flag.globalStatus)
      // setTimeout(function () {
      if (flag.globalStatus == "none") {
        touch.delta = getDelta(touch.start, getTouchPoint(e))
        if (!leaveDeadZone(touch.delta, setting.deadZoneRange) && touch.delta.time < 300) {
          if (dom.$raw.closest("a").length) {
            flag.fuckiosTracker = setInterval(function () {
              $this.off("touchstart touchmove touchend")
              $this.on("touchstart touchmove touchend", function (e) {
                e.preventDefault()
              })
              var all = $(".iSwipe-this")
              all.removeClass("iSwipe-this")
              setTrans(all.find(setting.swipe), 0)
              // $(".iSwipe-panel").remove()
              flag.globalStatus = "none"
              all.data("iSwipe-status", "none")
            }, 50)
            clearTimeout(flag.fuckiosTimer)
            flag.fuckiosTimer = setTimeout(function () {
              clearInterval(flag.fuckiosTracker)
              iSwipeSuperInit()
            }, 2000);
          }
          // dom.$raw.click()
          // if (dom.$raw.is("input")) {
          //   dom.$raw.focus()
          // }
        }
      }
      // })
    })

    function cacheThings(e) {
      cacheDom(e)
      cacheFlag(e)
      cacheTouch(e)
      cacheSwipperTrans()
    }

    function fixSlotStyle() {
      dom.$slot.height(dom.$slot.height() + "px")
    }

    function cacheDom(e) {
      dom.$slot = $(e.target).closest(setting.slot)
      dom.$swipper = dom.$slot.find(setting.swipe)
      dom.$btn = $(e.target).closest(".iSwipe-panel-btn").data("event-flag")
      dom.$raw = $(e.target)
    }

    function cacheFlag(e) {
      flag.thisStatus = dom.$slot.data("status") || "none"
      dom.$slot.addClass("iSwipe-this")
      flag.canLeft = (setting["panel-left"]) ? true : false
      flag.canRight = (setting["panel-right"]) ? true : false
      var str = dom.$slot.data("iSwipe-status") || "none"
      flag.target = (str != "none") ? "swipped" : "unswipped"
      flag.target = $(e.target).closest(".iSwipe-panel").length ? "panel" : flag.target
    }

    function cacheTouch(e) {
      touch.start = getTouchPoint(e)
      touch.$slotScroll = $this.scrollTop()
      touch.old = {
        x: 0,
        y: 0
      }
    }

    function cacheSwipperTrans() {
      style.swipperStartX = getTrans(dom.$swipper)
    }


    function switchTarget(e) {
      switch (flag.target) {
        case "unswipped":
          unswippedProgress()
          break
        case "swipped":
          swippedProgress()
          break
        case "panel":
          panelProgress()
          break
      }
    }


    function unswippedProgress() {
      globalSwippedProgress(swippingStart, normalScroll)
    }

    function swippedProgress() {
      globalSwippedProgress(swippingStart, function () {
        normalScroll()
        clearThisSwipper()
      })
      swippedTouchPrevent()
    }

    function globalSwippedProgress(fnA, FnB) {
      var fnA = arguments[0] || function () {}
      var fnB = arguments[1] || function () {}
      clearOtherSwipper()
      $this.on("touchmove", function (e) {
        e.preventDefault()
        touch.move = getTouchPoint(e)
        touch.delta = getDelta(touch.start, touch.move)
        if (leaveDeadZone(touch.delta, setting.deadZoneRange)) {
          touch.direction = getAngelDirection(fillPointDelta(touch.delta).angel)
          if (touch.direction == "left" || touch.direction == "right") {
            $this.off("touchmove")
            fnA()
          } else {
            fnB()
          }
        }
      })
    }

    function swippedTouchPrevent() {
      $this.on("touchend", function (e) {
        e.preventDefault()
        var delta = getDelta(touch.start, getTouchPoint(e))
        if (!leaveDeadZone(delta, 5) && delta.time < 300) {
          clearThisSwipper()
        }
      })
    }

    function clearThisSwipper() {
      flag.globalStatus = "moving"
      animeTrans(dom.$swipper, 0, 300)
      flag.clearTimer = setTimeout(function () {
        dom.$slot.find(".iSwipe-panel").remove()
      }, 300)
      dom.$slot.data("iSwipe-status", "none")
      $this.off("touchend touchmove")
    }

    function panelProgress() {
      $this.on("touchend", function (e) {
        touch.delta = getDelta(touch.start, getTouchPoint(e))
        if (!leaveDeadZone(touch.delta, setting.deadZoneRange) && touch.delta.time < 300) {
          if (setting.event[dom.$btn]) {
            setting.event[dom.$btn](dom.$slot)
          }
        }
        $this.off("touchend")
      })
    }

    function clearOtherSwipper() {
      clearTimeout(flag.clearTimer)
      var other = $(".iSwipe-this").not(dom.$slot)
      other.removeClass("iSwipe-this")
      animeTrans(other.find(setting.swipe), 0, 300)
      flag.clearTimer = setTimeout(function () {
        $(".iSwipe-panel").filter(function () {
          return !$(this).parents(setting.slot).hasClass("iSwipe-this")
        }).remove()
        flag.globalStatus = "none"
      }, 300)
      other.data("iSwipe-status", "none")
    }

    function swippingStart() {
      if (!dom.$slot.find(".iSwipe-panel").length) {
        preRenderPanel()
        cacheStyle()
        // addPanelEvent() 旧方法 过期请删除
      }
      fixStyle()
      swipperDraging()
    }

    function normalScroll() {
      $this.off("touchmove")
      // normalMove()
      // clearInterval(touch.speedTracker)
      // fnSpeedTracker()
      // normalEnd()
    }

    function normalMove() {
      $this.on("touchmove", function (e) {
        e.preventDefault()
        touch.move = getTouchPoint(e)
        touch.delta = getDelta(touch.start, touch.move)
        $this.scrollTop(touch.$slotScroll - touch.delta.y)
      })
    }

    function normalEnd() {
      $this.on("touchend", function (e) {
        clearInterval(touch.speedTracker)
        touch.speed.k = touch.speed.y / Math.abs(touch.speed.y)
        touch.speed.k = (Math.abs(touch.speed.y) < 0.1) ? 1 : touch.speed.k
        touch.speed.rawY = Math.round(Math.abs(touch.speed.y) * 0.8)
        // console.log("normal to end")
        // console.log("before", touch.speed.k, touch.speed.y, touch.speed.rawY)
        manualScroll()
        $this.off("touchmove touchend")
      })
    }

    function manualScroll() {
      flag.frameLooper = window.requestAnimationFrame(manualScroll)
      var scrollNow = $this.scrollTop()
      // console.log("looper.0", scrollNow, touch.speed.k, touch.speed.y, touch.speed.rawY)
      touch.speed.rawY = touch.speed.rawY * 0.95 - 1
      // console.log("looper.1", scrollNow, touch.speed.k, touch.speed.y, touch.speed.rawY)
      $this.scrollTop(scrollNow - touch.speed.k * touch.speed.rawY)
      // console.log("looper.2", scrollNow, touch.speed.k, touch.speed.y, touch.speed.rawY)
      if (touch.speed.rawY < 2) {
        window.cancelAnimationFrame(flag.frameLooper)
      }

    }


    function preRenderPanel() {
      style.$slot.Zi = dom.$slot.css("z-index")
      style.$swipper.Zi = dom.$swipper.css("z-index")
      if (Number(style.$slot.Zi) > 0) {
        dom.$slot.css({
          "z-index": "1",
        })
      }
      dom.$slot.css({
        "position": "relative",
        "overflow": "hidden",
      })
      dom.$swipper.css({
        "z-index": "2",
        "position": "absolute",
      })
      dom.$panelLeft = $($(setting["panel-left"]).text() || "<div/>").addClass("iSwipe-panel iSwipe-panel-left").css({
        "position": "absolute",
        "left": 0,
        "height": "100%",
        "top": 0,
        "bottom": 0,
        "z-index": "1",
      }).appendTo(dom.$slot)
      dom.$panelRight = $($(setting["panel-right"]).text() || "<div/>").addClass("iSwipe-panel iSwipe-panel-right").css({
        "position": "absolute",
        "right": 0,
        "height": "100%",
        "top": 0,
        "bottom": 0,
        "z-index": "1",
      }).appendTo(dom.$slot)
      $.each(setting.event, function (selector, fn) {
        $(".iSwipe-panel").find(selector).addClass("iSwipe-panel-btn").data("event-flag", selector)
      })
    }

    function cacheStyle() {
      touch.range = [-dom.$panelRight.outerWidth() || 0, dom.$panelLeft.outerWidth() || 0]
    }

    function addPanelEvent() {
      if (setting.event) {
        setting.event(dom.$slot)
      }
    }

    function fixStyle() {
      setTrans(dom.$swipper, preventRange(style.swipperStartX + touch.delta.x, touch.range))
    }

    function swipperDraging() {
      swipperMove()
      clearInterval(touch.speedTracker)
      fnSpeedTracker()
      swipperEnd()
    }

    function swipperMove() {
      $this.on("touchmove", function (e) {
        e.preventDefault()
        touch.move = getTouchPoint(e)
        touch.delta = getDelta(touch.start, touch.move)
        var deltaShow = preventRange(style.swipperStartX + touch.delta.x, touch.range)
        stopTrans(dom.$swipper)
        setTrans(dom.$swipper, deltaShow)
      })
    }

    // function speedTracker() {
    //   touch.speed = {
    //     x: touch.move.x - touch.old.x,
    //     y: touch.move.y - touch.old.y
    //   }
    //   touch.old = {
    //     x: touch.move.x,
    //     y: touch.move.y
    //   }
    //   touch.speedTracker = window.requestAnimationFrame(speedTracker)
    // }

    function fnSpeedTracker() {
      touch.speed = {
        x: 0,
        y: 0
      }
      touch.old = {
        x: 0,
        y: 0
      }
      touch.speedTracker = setInterval(function () {
        touch.speed = {
          x: touch.move.x - touch.old.x,
          y: touch.move.y - touch.old.y
        }
        touch.old = {
          x: touch.move.x,
          y: touch.move.y
        }
        // console.log(touch.speedTracker, touch.move.y, touch.delta.y, touch.speed.y)
      }, 10)
    }

    function swipperEnd() {
      $this.on("touchend", function (e) {
        closeSwipe()
      })
    }

    function closeSwipe() {
      clearInterval(touch.speedTracker)
      refreshStatus()
      alignSwipper()
      $this.off("touchmove touchend")
    }

    function refreshStatus() {
      touch.landing = style.swipperStartX + touch.delta.x + touch.speed.x * 10
      flag.thisStatus = "none"
      if (flag.canLeft && touch.landing > touch.range[1] / 2) {
        dom.$slot.data("iSwipe-status", "left")
        flag.thisStatus = "left"
      }
      if (flag.canRight && touch.landing < touch.range[0] / 2) {
        dom.$slot.data("iSwipe-status", "right")
        flag.thisStatus = "right"
      }
      flag.globalStatus = flag.thisStatus
    }

    function alignSwipper() {
      var align = 0
      switch (flag.thisStatus) {
        case "left":
          align = touch.range[1]
          break
        case "right":
          align = touch.range[0]
          break
      }
      animeTrans(dom.$swipper, align)
    }

  })
};

function getTrans(e) {
  return ($(e).css("transform") == "none") ? 0 : $(e).css("transform").split(',')[4].replace(" ", "").replace(")", "") - 0
}

function setTrans(e, dis) {
  $(e).css({
    "transform": "translate3d(" + dis + "px,0,0)"
  })
}

function animeTrans() {
  var e = arguments[0]
  var dis = arguments[1]
  var duration = arguments[2] || 300
  $(e).css({
    "transition-duration": duration + "ms",
    "transition-timing-function": "cubic-bezier(0,0,.58,1)"
  })
  $(e).css({
    "transform": "translate3d(" + dis + "px,0,0)"
  })
}

function stopTrans(e) {
  $(e).css({
    "transition-duration": "0s"
  })
}

function getTouchPoint(e) {
  // var e = this
  var time = Date.now()
  if (e.type.match("mouse")) {
    return {
      x: e.clientX,
      y: e.clientY,
      time: time,
    }
  } else if (e.type == "touchstart" || e.type == "touchmove") {
    return {
      x: e.originalEvent.touches[0].clientX,
      y: e.originalEvent.touches[0].clientY,
      time: time,
    }
  } else if (e.type == "touchend") {
    return {
      x: e.originalEvent.changedTouches[0].clientX,
      y: e.originalEvent.changedTouches[0].clientY,
      time: time,
    }
  }
}


function leaveDeadZone(point, range) {
  if (Math.abs(point.x) > range) {
    return true
  }
  if (Math.abs(point.y) > range) {
    return true
  }
  return false
}

function getDelta(a, b) {
  var d = {
    x: b.x - a.x,
    y: b.y - a.y,
    time: b.time - a.time,
  }
  return d
}

function fillPointDelta(d) {
  d.distance = Math.sqrt(d.x * d.x + d.y * d.y)
  d.angel = Math.round((Math.asin(d.y / d.distance) / Math.PI * 180))
  d.angel = (d.x < 0) ? 180 - d.angel : d.angel
  d.angel = (d.x > 0 && d.y < 0) ? 360 + d.angel : d.angel
  return d
}

function getAngelDirection(angel) {
  angel = angel - Math.floor(angel / 360) * 360
  var compass = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  }
  var tolerant = 30

  if (angel > 360 - tolerant) {
    return "right"
  }
  for (var point in compass) {
    if (Math.abs(angel - compass[point]) < tolerant) {
      return point
    }
  }
  return "none"
}

function preventRange(x, range) {
  if (x < range[0]) {
    return range[0]
  }
  if (range[1] < x) {
    return range[1]
  }
  return x
}