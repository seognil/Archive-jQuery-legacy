function iPicker(options) {
  var setting = $.extend({
    dataType: '', // static | dynamic / 数据类型
    slot: undefined, // 3 / 队列个数
    showType: 'toast', // toast | inline / 显示类型 全屏弹出和局部弹出
    data: [], // 数据 必传
    row: undefined, // 7 / 如果有则按照此参数重新设定item高度
    startWith: [], // [0,2,1] / 初始选择位置 window.cache
    flex: [1, 1, 1], //
    callback: function (result) {}, // 回调函数
  }, options)
  // var data, style, dom, classname, flag, touch;

  function initCache() {
    data = {
      dataType: '', // 'static' / 类型
      slot: 0, // 3 / 槽位
      candidate: [], // [[],[],[]] / 缓存当前候选文字
      range: [], // [9, 9, 9] / 缓存每个槽位的滚动数量
      chosen: [], // [0, 0, 0] / 当前选择的序号
      result: [], // ['文字','文字','文字'] / 当前选择的文字
      source: undefined, // 复制数据源
    }
    style = {
      showType: '',
      row: undefined,
      pickerHeight: 0,
      controlHeight: 0,
      rollerHeight: 0,
      maskHeight: 0,
      itemHeight: 0,
      rollerTop: 0,
      flex: [],
    }
    dom = {
      $bgMask: undefined,
      $pickerContainer: undefined,
      $controlContainer: undefined,
      $btnCancel: undefined,
      $btnConfirm: undefined,
      $rollerContainer: undefined,
      $slotContainer: undefined,
      $slotMask: undefined,
      $slotIndicator: undefined,
      $slotWrapper: undefined,
      $slotItem: undefined,
    }
    classname = {
      bgMask: "iPicker-bgMask",
      pickerContainer: "iPicker-pickerContainer",
      controlContainer: "iPicker-controlContainer",
      btnCancel: "iPicker-btnCancel",
      btnConfirm: "iPicker-btnConfirm",
      rollerContainer: "iPicker-rollerContainer",
      slotContainer: "iPicker-slotContainer",
      slotMask: "iPicker-slotMask",
      slotIndicator: "iPicker-slotIndicator",
      slotWrapper: "iPicker-slotWrapper",
      slotItem: "iPicker-slotItem",
    }
    flag = {
      fader: [],
      throttler: {},
      touchStartArea: undefined,
      touchState: undefined,
      touchedEq: undefined,
      // touchedWrapper: undefined,
    }
    touch = {
      speedTracker: undefined,
      startTime: undefined,
      endTime: undefined,
      startPoint: {},
      endPoint: {},
      deltaY: 0,
      deltaYOld: 0,
      scrollDuration: 300,
      error: {
        distance: 5,
        duration: 300,
      },
      slotStartTrans: 0,
    }
  }

  function pickerStart() {
    initCache()
    handleData()
    preRenderPicker()
    handleStyle()
    showPicker()
    addEvent()
  }
  pickerStart()

  function pickerEnd() {
    dom.$pickerShower.fadeOut(100)
    setTimeout(function () {
      dom.$pickerShower.remove()
    }, 101)
    flag.touchStartArea = "none"
  }

  function pickerConfirm() {
    data.result = []
    looper(data.slot, function (i) {
      checkChosen(i)
      data.result.push(data.candidate[i][data.chosen[i]])
    })
    if (data.dataType == "static") {
      setting.callback(data.chosen, data.result)
    } else if (data.dataType == "dynamic") {
      var explicitChosen = []
      var explicitResult = []
      looper(data.slot, function (i) {
        explicitChosen.push(data.result[i].code)
        explicitResult.push(data.result[i].name)
      })
      setting.callback(explicitChosen, explicitResult)
    }
  }

  function handleData() {
    initData() // setting -> data
    formatSource() // data.source, data.dataType
    initSlot() // data.slot
    // formatDynamic()
    initChosen() // data.chosen
    preTreatData() // data.source, data.chosen -> data.candidate, data.range
  }

  function preRenderPicker() {
    prepareFaker() // make a hidden dom to enable calculate
    preRenderContainer() // render container without slot to the Hidden Dom
    preRenderRoller() // render roller slot
    preRenderSlot() // fill with data
  }

  function handleStyle() {
    calcStyle() //
    fixStyle() //
    windowResizeEvent() // recalcStyle
  }

  function showPicker() {
    dom.$pickerShower.fadeOut(0).appendTo("body").fadeIn(100)
    $(".iFaker").remove()
  }

  function addEvent() {
    addPreventDefault()
    addMaskEvent()
    addControlEvent()
    addRollerEvent()
  }

  function initData() {
    data.dataType = setting.dataType
    data.source = setting.source.slice()
    data.slot = setting.slot
    data.chosen = setting.startWith.slice()
  }

  function formatSource() {
    data.dataType = "static"
    if (typeof data.source[0] === "string") {
      data.source = [data.source]
    } else if (data.source[0] instanceof Array) {} else if (data.source[0] instanceof Object) {
      data.dataType = "dynamic"
    }
  }

  function initSlot() {
    data.slot = data.source.length
  }

  function formatDynamic() {
    // if (data.dataType == "dynamic") {
    //   var sourceWrapper = {sub:[]}
    //   for (var i of data.source[0]){
    //     sourceWrapper.sub.push(i.code)
    //   }
    // }
  }

  function initChosen() {
    data.chosen = data.chosen || []
    looper(data.slot, function (i) {
      data.chosen[i] = data.chosen[i] || 0
    })
    looper(data.slot, function (i) {
      if ($.isNumeric(data.chosen[i])) {
        data.chosen[i] = Number(data.chosen[i])
      }
    })
    data.chosen.length = data.slot
    data.range.length = data.slot
  }

  function preTreatData() {
    if (data.dataType == "static") {
      looper(data.slot, function (i) {
        data.candidate[i] = data.source[i]
        data.range[i] = data.candidate[i].length
        checkChosen(i)
      })
    } else if (data.dataType == "dynamic") {
      looper(data.slot, function (i) {
        dynamicHandleData(i)
      })
    }
  }

  function prepareFaker() {
    $("<div class='iFaker'/>").css({
      'position': 'fixed',
      'top': 0,
      'left': 0,
      'bottom': 0,
      'right': 0,
      // 'opacity': 0,
      // 'z-index': -999999,
      'pointer-events': 'none',
    }).appendTo("body")
    style.showType = setting.showType
    style.row = setting.row
  }

  function preRenderContainer() {
    if (style.showType == "toast") {
      pickerDomGen("bgMask", ".iFaker")
      pickerDomGen("pickerContainer", ".iFaker").addClass("iPickerToast")
    }
    pickerDomGen("controlContainer", dom.$pickerContainer)
    pickerDomGen("btnCancel", dom.$controlContainer).text("取消")
    pickerDomGen("btnConfirm", dom.$controlContainer).text("确定")
    pickerDomGen("rollerContainer", dom.$pickerContainer)
    dom.$pickerShower = dom.$bgMask.add(dom.$pickerContainer)
  }

  function preRenderRoller() {
    looper(data.slot, function (i) {
      pickerDomGen("slotContainer", dom.$rollerContainer)
      pickerDomGen("slotMask", dom.$slotContainer)
      pickerDomGen("slotIndicator", dom.$slotContainer)
      pickerDomGen("slotWrapper", dom.$slotContainer)
    })
    dom.$slotContainer = $("." + classname.slotContainer)
    dom.$slotMask = $("." + classname.slotMask)
    dom.$slotIndicator = $("." + classname.slotIndicator)
    dom.$slotWrapper = $("." + classname.slotWrapper)
  }

  function preRenderSlot() {
    looper(data.slot, function (i) {
      updateSlot(i)
    })
  }

  function calcStyle() {
    style.flex = setting.flex
    looper(data.slot, function (i) {
      style.flex[i] = style.flex[i] || 1
    })
    style.pickerHeight = dom.$pickerContainer.height()
    style.controlHeight = dom.$controlContainer.height()
    style.rollerHeight = dom.$rollerContainer.height()
    if (style.row) {
      style.itemHeight = style.rollerHeight / style.row
    } else {
      style.itemHeight = $("." + classname.slotItem).height()
    }
    style.maskHeight = (style.rollerHeight - style.itemHeight) / 2
    style.rollerTop = dom.$rollerContainer[0].getBoundingClientRect().top
    style.slotUpTop = (style.rollerHeight - style.itemHeight) / 2
    style.slotDownTop = style.slotUpTop + style.itemHeight
  }

  function fixStyle() {
    dom.$slotMask.css({
      "background-size": "100% " + style.maskHeight + "px",
    })
    dom.$slotIndicator.css({
      "height": style.itemHeight + "px",
      "top": style.maskHeight + "px",
    })
    looper(data.slot, function (i) {
      dom.$slotContainer.eq(i).css({
        "flex-grow": style.flex[i]
      })
    })
    alignWrapper()
    // setTrans(dom.$slotWrapper, style.maskHeight)
  }

  function windowResizeEvent() {
    $(window).on("resize", function () {
      clearInterval(flag.throttler.resizeCheck)
      clearTimeout(flag.throttler.checkLoop)
      flag.throttler.checkLoop = setTimeout(function () {
        clearInterval(flag.throttler.resizeCheck)
      }, 2000)
      flag.throttler.resizeCheck = setInterval(function () {
        if (dom.$pickerContainer.height() != style.pickerHeight) {
          calcStyle()
          fixStyle()
        }
      }, 100)
    })
  }

  function addPreventDefault() {
    $("body").on("mousemove touchmove mousewheel", function (e) {
      if (flag.touchStartArea != "none") {
        e.preventDefault()
      }
    })
    dom.$bgMask.add(dom.$pickerContainer).add(dom.$controlContainer).add(dom.$rollerContainer).on("mousedown touchstart", function (e) {
      e.preventDefault()
    })
  }

  function addMaskEvent() {
    dom.$bgMask.tap(function () {
      pickerEnd()
    })
  }

  function addControlEvent() {
    dom.$btnCancel.tap(function () {
      pickerEnd()
    })
    dom.$btnConfirm.tap(function () {
      pickerConfirm()
      pickerEnd()
    })
  }

  function addRollerEvent() {
    dom.$slotContainer.on("mousedown touchstart", function (e) {
      e.preventDefault()
      if (flag.touchState != "touchstart") {
        flag.touchState = "touchstart"
        flag.touchStartArea = "slot"
        flag.touchedEq = $(this).index()
        flag.touchedWrapper = dom.$slotWrapper.eq(flag.touchedEq)
        touch.startPoint = getTouchPoint(e)
        touch.startTime = Date.now()
        touch.slotStartTrans = getTrans(flag.touchedWrapper)
        touch.speedTracker = setInterval(recordSpeed, 32)
      }
    })
    $("body").on("mousemove touchmove", function (e) {
      if (flag.touchStartArea == "slot") {
        // e.preventDefault()
        if (flag.touchState == "touchstart") {
          touch.deltaY = getTouchPoint(e).y - touch.startPoint.y
          stopTrans(flag.touchedWrapper)
          setTrans(flag.touchedWrapper, touch.slotStartTrans + touch.deltaY)
        }
      }
    })
    $("body").on("mouseup touchend", function (e) {
      if (flag.touchStartArea == "slot") {
        e.preventDefault()
        if (flag.touchState != "touchend") {
          flag.touchState = "touchend"
          touch.endPoint = getTouchPoint(e)
          touch.endTime = Date.now()
          clearInterval(touch.speedTracker)
          if (checkTapped()) {
            slotTapper()
          } else {
            slotRoller()
          }
        }
      }
      flag.touchStartArea == "none"
    })
  }


  function checkChosen(i) {
    data.chosen[i] = Math.min(data.chosen[i], data.range[i] - 1)
    data.chosen[i] = Math.max(0, data.chosen[i])
  }

  function dynamicHandleData(i) {
    data.candidate[i] = []
    if (i == 0) {
      for (var k in data.source[i]) {
        data.candidate[i].push(data.source[i][k])
      }
      data.range[i] = data.candidate[i].length
    } else {
      var codeList = data.candidate[i - 1][data.chosen[i - 1]] ? data.candidate[i - 1][data.chosen[i - 1]].sub : data.candidate[i - 1][0].sub
      data.chosen[i] = 0
      for (var k in codeList) {
        var sub = data.source[i][codeList[k]]
        if (sub) {
          data.candidate[i].push(sub)
        } else {
          console.warn("找不到 " + k)
        }
      }
      data.range[i] = data.candidate[i].length
      checkChosen(i)
    }
    if ($.isNumeric(data.chosen[i])) {
      data.chosen[i] = Number(data.chosen[i])
    } else {
      data.chosen[i] = data.candidate[i].indexOf(data.source[i][data.chosen[i]]) || 0
    }
  }

  function slotTapper() {
    var relativeY = touch.endPoint.y - style.rollerTop
    checkChosen(flag.touchedEq)
    if (style.slotDownTop < relativeY && relativeY < style.rollerHeight) {
      chosenAdd()
    } else if (0 < relativeY && relativeY < style.slotUpTop) {
      chosenMinus()
    }
  }


  function chosenAdd() {
    if (data.chosen[flag.touchedEq] == data.range[flag.touchedEq] - 1) {} else {
      data.chosen[flag.touchedEq] = Math.min(data.chosen[flag.touchedEq] + 1, data.range[flag.touchedEq] - 1)
      dynamicUpdate()
      alignWrapper()
    }
  }

  function chosenMinus() {
    if (data.chosen[flag.touchedEq] == 0) {} else {
      data.chosen[flag.touchedEq] = Math.max(data.chosen[flag.touchedEq] - 1, 0)
      dynamicUpdate()
      alignWrapper()
    }
  }

  function slotRoller() {
    var finalDistance = getTrans(flag.touchedWrapper) + touch.speedY * 2
    if (finalDistance < style.maskHeight - data.range[flag.touchedEq] * style.itemHeight) {
      data.chosen[flag.touchedEq] = data.range[flag.touchedEq] - 1
      dynamicUpdate()
      animeTrans(flag.touchedWrapper, style.maskHeight - data.chosen[flag.touchedEq] * style.itemHeight, 150)
    } else if (style.maskHeight < finalDistance) {
      data.chosen[flag.touchedEq] = 0
      dynamicUpdate()
      animeTrans(flag.touchedWrapper, style.maskHeight - data.chosen[flag.touchedEq] * style.itemHeight, 150)
    } else {
      data.chosen[flag.touchedEq] = Math.round(-(finalDistance - style.maskHeight) / style.itemHeight)
      data.chosen[flag.touchedEq] = (data.chosen[flag.touchedEq] >= data.range[flag.touchedEq]) ? data.chosen[flag.touchedEq] - 1 : data.chosen[flag.touchedEq]
      dynamicUpdate()
      animeTrans(flag.touchedWrapper, style.maskHeight - data.chosen[flag.touchedEq] * style.itemHeight)
    }
  }

  function dynamicUpdate() {
    if (data.dataType == "dynamic") {
      var dynamicRange = [flag.touchedEq + 1, data.slot - 1]
      looper(dynamicRange, function (i) {
        dynamicHandleData(i)
        updateSlot(i)
      })
      alignWrapper()
    }
  }

  function updateSlot(i) {
    var showedText
    var $slot = dom.$slotWrapper.eq(i)
    // if (!flag.fader[i]) {
    //   flag.fader[i] = {
    //     faderReady: false,
    //     fading: false,
    //   }
    // }
    // if (flag.fader[i].faderReady) {
    //   if (!flag.fader[i].fading) {
    //     flag.fader[i].fading = true
    //     clearTimeout(flag.fader[i].fadeInFlag)
    //     $slot.fadeOut(100)
    //     flag.fader[i].emptyFlag = setTimeout(function() {
    $slot.empty()
    //     }, 100)
    //   }
    // }
    looper(data.range[i], function (j) {
      if (data.dataType == "static") {
        showedText = data.candidate[i][j]
      } else if (data.dataType == "dynamic") {
        showedText = data.candidate[i][j]["name"]
      }
      $("<div class='" + classname.slotItem + "'>" + showedText + "</div>").appendTo($slot)
    })
    alignWrapper([i, i])
    // animeTrans(dom.$slotWrapper.eq(i), style.maskHeight - Math.maxdata.chosen[i] * style.itemHeight)
    // flag.fader[i].fadeInFlag = setTimeout(function() {
    //   $slot.fadeIn(100)
    //   flag.fader[i].fading = false
    // }, 200)
    // flag.fader[i].faderReady = true
  }

  function pickerDomGen() {
    $dom = arguments[0]
    $target = arguments[1]
    dom["$" + $dom] = $("<div class='" + classname[$dom] + "'/>").appendTo($target)
    return dom["$" + $dom]
  }



  function getTrans(e) {
    return ($(e).css("transform") == "none") ? 0 : $(e).css("transform").split(',')[5].replace(" ", "").replace(")", "") - 0
  }

  function setTrans(e, dis) {
    $(e).css({
      "transform": "translate3d(0," + dis + "px,0)"
    })
  }

  function stopTrans(e) {
    $(e).css({
      "transition-duration": "0s"
    })
  }

  function animeTrans() {
    var e = arguments[0]
    var dis = arguments[1]
    var duration = arguments[2] || touch.scrollDuration
    $(e).css({
      "transition-duration": duration + "ms",
      "transition-timing-function": "cubic-bezier(0,0,.58,1)"
    })
    $(e).css({
      "transform": "translate3d(0, " + dis + "px, 0)"
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
    return ((Math.abs(touch.endPoint.x - touch.startPoint.x) < touch.error.distance) && (Math.abs(touch.endPoint.y - touch.startPoint.y) < touch.error.distance) && (Math.abs(touch.endTime - touch.startTime) < touch.error.duration))
  }

  function roundTrans(dis, offset, unit) {
    return (Math.round((dis - offset) / unit)) * unit + offset
  }

  function alignWrapper() {
    var loopCount = arguments[0] || data.slot
    looper(loopCount, function (i) {
      animeTrans(dom.$slotWrapper.eq(i), style.maskHeight - Math.min(data.range[i] - 1, data.chosen[i]) * style.itemHeight)
    })
  }

  function recordSpeed() {
    touch.speedY = touch.deltaY - touch.deltaYOld
    touch.deltaYOld = touch.deltaY
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