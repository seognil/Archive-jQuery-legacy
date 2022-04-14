$.fn.tap = function() {
  if (window.i_jquery_tap === undefined) {
    window.i_jquery_tap = {
      error: {
        distance: 5,
        duration: 300
      },
      currentFn: {},
    }
  }
  if (arguments[0] == undefined) {
    for (var e of getExistFlag(this))
      $(this).data(e)()
  } else {
    var newFn = arguments[0]
    var newFlag = "tap-" + Math.random().toString(36).slice(2, 2 + 6)
    this.each(function() {
      $(this).css("cursor", "pointer")
      var existFlag = getExistFlag()
      existFlag.push(newFlag) //
      $(this).data("tap-flag", existFlag)
      $(this).data(newFlag, newFn)
      $(this).on("mousedown touchstart", function(e) {
        // e.preventDefault()
        if ((e.type.match("touch") || e.button == 0) && window.i_jquery_tap.touchState != "touchstart") {
          window.i_jquery_tap.currentFn = []
          for (var f of getExistFlag(this)) {
            window.i_jquery_tap.currentFn.push($(this).data(f))
          }
          window.i_jquery_tap.touchState = "touchstart"
          window.i_jquery_tap.touchType = "tap"
          window.i_jquery_tap.startTime = Date.now()
          window.i_jquery_tap.startPoint = getTouchPoint(e)
        }
      })
    })
    $("body").on("mouseup touchend", function(e) {
      if (window.i_jquery_tap.touchType == "tap") {
        e.preventDefault()
        if (window.i_jquery_tap.touchState != "touchend") {
          if (e.type.match("touch") || e.button == 0) {
            window.i_jquery_tap.touchState = "touchend"
            window.i_jquery_tap.endTime = Date.now()
            window.i_jquery_tap.endPoint = getTouchPoint(e)
            if (checkTapped()) {
              for (var e of window.i_jquery_tap.currentFn) {
                e()
              }
            }
          }
        }
        window.i_jquery_tap.touchType = "none"
      }
    })
  }

  function getTouchPoint(e) {
    if (e.type.match("mouse")) {
      return {
        x: e.clientX,
        y: e.clientY,
      }
    } else if (e.type == "touchstart" || e.type == "touchmove") {
      return {
        x: e.originalEvent.touches[0].clientX,
        y: e.originalEvent.touches[0].clientY,
      }
    } else if (e.type == "touchend") {
      return {
        x: e.originalEvent.changedTouches[0].clientX,
        y: e.originalEvent.changedTouches[0].clientY,
      }
    }
  }

  function checkTapped() {
    return ((Math.abs(window.i_jquery_tap.endPoint.x - window.i_jquery_tap.startPoint.x) < window.i_jquery_tap.error.distance) && (Math.abs(window.i_jquery_tap.endPoint.y - window.i_jquery_tap.startPoint.y) < window.i_jquery_tap.error.distance) && (Math.abs(window.i_jquery_tap.endTime - window.i_jquery_tap.startTime) < window.i_jquery_tap.error.duration))
  }

  function getExistFlag(e) {
    return $(e).data("tapFlag") ? $(e).data("tapFlag") : []
  }
  return $(this)
}
