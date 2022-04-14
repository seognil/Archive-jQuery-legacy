function iPicker(options) {
  // var log = dt || console.log
  // var dt = console.log
  var flag = {
    trigged: false,
  }
  var data = {
    slot: 1,
    listNow: [],
    chosen: [],
    source: undefined,
    result: [],
  }
  var dom = {}
  var style = {
    itemHeight: 40,
  }
  var settings = $.extend({
    'type': 'static', //数据类型 static | dynamic
    'data': [],
    'slot': 1, //可选 纵向滚动槽数量
    'row': 5, //可选 行数
    'output': undefined,
    'callback': function(result) {
      // log("没有回调", result)
    }, //回调函数
  }, options)

  // function triggerTouchStart() {
  if (!flag.trigged) {
    flag.trigged = true
    pickerStart()
  }
  // }()

  function pickerStart() {
    clickPreventer()
    cacheData()
    cacheDistance()
    renderDom()
    addEvent()
  }

  function clickPreventer() {
    // e.preventDefault()
    $("<div/>").focus()
    document.activeElement.blur()
  }

  function cacheData() {
    cacheSource()
    checkSlot()
    initChosen()
  }

  function cacheSource() {
    data.source = settings.data
    if (settings.type == "static") {
      if (data.source[0] instanceof Array) {
        data.listNow = data.source
      } else {
        data.listNow = [data.source]
      }
    }
  }

  function checkSlot() {
    if (settings.type == "static") {
      data.slot = data.listNow.length
    }
  }

  function initChosen() {
    data.chosen = []
    looper(data.slot, function() {
      data.chosen.push(0)
    })
  }

  function cacheDistance() {
    style.rollerHeight = settings.row * style.itemHeight
    style.maskTopDistance = (settings.row - 1) / 2 * style.itemHeight
  }

  function renderDom() {
    renderContainer()
    renderRoller()
    styleRoller()
    initTrans()
  }

  function renderContainer() {
    dom.$mask = $("<div id='iPicker-mask'/>").appendTo("body")
    dom.$main = $("<div id='iPicker-main'/>").appendTo("body")
    dom.$actionBar = $("<div id='iPicker-actionBar'/>").appendTo(dom.$main)
    dom.$btnCancel = $("<div id='iPicker-btnCancel'/>").text("取消").appendTo(dom.$actionBar)
    dom.$btnConfirm = $("<div id='iPicker-btnConfirm'/>").text("完成").appendTo(dom.$actionBar)
    dom.$rollerContainer = $("<div id='iPicker-rollerContainer'/>").appendTo(dom.$main)
  }

  function renderRoller() {
    looper(data.listNow.length, function(i) {
      var $slotContainer = $("<div class='iPicker-slotContainer'/>").appendTo(dom.$rollerContainer)
      var $slotMask = $("<div class='iPicker-slotMask'/>").appendTo($slotContainer)
      var $slotIndicator = $("<div class='iPicker-slotIndicator'/>").appendTo($slotContainer)
      var $slotWrap = $("<div class='iPicker-slotWrap'/>").appendTo($slotContainer)
      looper(data.listNow[i].length, function(j) {
        var $item = $("<div class='iPicker-slotItem'/>").text(data.listNow[i][j]).appendTo($slotWrap)
      })
    })
  }

  function styleRoller() {
    setCss("#iPicker-rollerContainer", "height", style.rollerHeight + "px")
    setCss(".iPicker-slotMask", "background-size", "100% " + style.maskTopDistance + "px")
    setCss(".iPicker-slotIndicator", "top", style.maskTopDistance + "px")
    setCss(".iPicker-slotIndicator", "height", style.itemHeight + "px")
    setCss(".iPicker-slotItem", "height", style.itemHeight + "px")
    setCss(".iPicker-slotItem", "line-height", style.itemHeight + "px")
  }

  function initTrans() {
    setTrans(".iPicker-slotWrap", style.maskTopDistance)
  }

  function addEvent() {
    addBtnEvent()
    addMaskEvent()
    addTapEvent()
    addDragEvent()
  }

  function addBtnEvent() {
    dom.$btnCancel.on("mousedown touchstart", function() {
      flag.touchStartArea = "btnCancel"
    })
    dom.$btnCancel.on("mouseup touchend", function() {
      if (flag.touchStartArea == "btnCancel") {
        actCancel()
      }
    })
    dom.$btnConfirm.on("mousedown touchstart", function() {
      flag.touchStartArea = "btnConfirm"
    })
    dom.$btnConfirm.on("mouseup touchend", function() {
      if (flag.touchStartArea == "btnConfirm") {
        flag.touchStartArea = "none"
        actConfirm()
      }
    })
  }

  function actConfirm() {
    setResult()
    // $(settings.output).text(data.result)
    if (flag.confirmed != "true") {
      settings.callback(data.result)
      flag.confirmed = "true"
    }
    pickerEnd()
  }

  function actCancel() {
    pickerEnd()
  }

  function setResult() {
    data.result = []
    for (var slot in data.listNow) {
      data.result.push(data.listNow[slot][data.chosen[slot]])
    }
  }

  function addMaskEvent() {
    dom.$mask.on("mousedown touchstart", function() {
      flag.touchStartArea = "mask"
    })
    dom.$mask.on("mouseup touchend", function() {
      if (flag.touchStartArea == "mask") {
        actCancel()
        flag.touchStartArea = "none"
      }
    })
  }

  function addTapEvent() {}

  function addDragEvent() {
    $(".iPicker-slotContainer").on("mousedown touchstart", function(e) {
      flag.touchStartArea = "slot"
      flag.touchStartTime = Date.now()
      flag.dragging = "start"
      flag.draggedSlot = $(this)
      flag.draggedWrap = $(this).find(".iPicker-slotWrap")
      flag.wrapStartY = getTrans(flag.draggedWrap)
      flag.deltaYOld = 0
      flag.recTimer = setInterval(recSpeed, 32)
      flag.startY = getTouchY(e)

    })
    $("body").on("mousemove touchmove", function(e) {
      if (flag.touchStartArea == "slot") {
        flag.dragging = "move"
        flag.deltaY = getTouchY(e) - flag.startY
        stopTrans(flag.draggedWrap)
        setTrans(flag.draggedWrap, flag.wrapStartY + flag.deltaY)
      }
    })
    $("body").on("mouseup touchend", function(e) {
      if (flag.touchStartArea == "slot") {
        clearInterval(flag.recTimer)
        if (flag.dragging == "move") {
          alignWrap(flag.draggedWrap)
        }
        flag.dragging = "end"
      }
    })
  }

  function getTouchY(e) {
    if (e.type.match("mouse")) {
      return e.clientY
    } else if (e.type.match("touch")) {
      return e.touches[0].clientY
    }
    // return 0
  }

  function recSpeed() {
    flag.dragSpeed = flag.deltaY - flag.deltaYOld
    flag.deltaYOld = flag.deltaY
  }

  function alignWrap(wrap) {
    var dis = getTrans(wrap) + flag.dragSpeed * 2.5
    var slotIndex = flag.draggedSlot.index()
    var chosenRange = [0, data.listNow[slotIndex].length - 1]
    var transRange = [style.maskTopDistance, style.maskTopDistance - chosenRange[1] * style.itemHeight]
    var chosenIndex = 0
    if (dis >= transRange[0]) {
      chosenIndex = 0
      dis = transRange[0]
    } else if (dis <= transRange[1]) {
      chosenIndex = chosenRange[1]
      dis = transRange[1]
    } else {
      var chosenIndex = -Math.round((dis - style.maskTopDistance) / style.itemHeight)
      dis = style.maskTopDistance - chosenIndex * style.itemHeight
    }
    data.chosen[slotIndex] = chosenIndex
    animeTrans(wrap, dis)
  }

  function pickerEnd() {
    dom.$mask.add(dom.$main).fadeOut(100)
    setTimeout(function() {
      dom.$mask.add(dom.$main).remove()
    }, 100)
    flag.trigged = false
  }

}

function looper(count, fn) {
  for (var i = 0, len = count; i < len; i++) {
    fn(i)
  }
}

function setCss(ele, attr, val) {
  if (!$("head").children("style").filter("[data-sc-ele='" + ele.replace(" ", "") + "']").filter("[data-sc-attr='" + attr + "']").length) {
    var str = '<style data-sc-ele=' + ele.replace(" ", "") + ' data-sc-attr=' + attr + '>' + ele + '{' + attr + ':' + val + '!important}</style>'
    $(str).appendTo("head");
  }
};




function getTrans(e) {
  return $(e).css("transform").split(',')[5].replace(" ", "").replace(")", "") - 0
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

function animeTrans(e, dis) {
  $(e).css({
    "transition-duration": "300ms"
  })
  $(e).css({
    "transform": "translate3d(0, " + dis + "px, 0)"
  })
}
