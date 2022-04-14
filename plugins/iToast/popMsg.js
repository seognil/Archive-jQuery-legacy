$.popMsg = {
  show: function(options) {
    function popBtnConfirm() {
      console.log("嘿！你忘记定义函数了");
    };
    var settings = $.extend({
      "class": "popDefault",
      "choice": "no",
      "type": "",
      "confirm": "确定",
      "cancel": "取消",
      "message": "这是一个弹窗",
      "duration": "3000",
      "call": popBtnConfirm
    }, options);
    settings.choice = toBool(settings.choice);
    settings.duration = toMs(settings.duration);
    //
    var $popWrapper;
    var $popMain;
    var $popShadow;
    var $yes;
    var $no;
    var $btn;
    var flagHide = false;
    //
    if (!$("#idpPopMsg").length) {
      // $("<style>.popDefault{width:60vmin;background:white;text-align:center;border-radius:1.25vmin;border:.25vmin solid hsla(0,0%,0%,.3);box-shadow:0 .8vmin .8vmin -0.2vmin hsla(0,0%,0%,0.3);overflow:hidden}.popContext{margin:10vmin 6vmin;font-size:4vmin;color:hsl(0,0%,30%)}.popBtn{width:50%;float:left;border-top:.25vmin solid hsla(0,0%,0%,.3);box-sizing:border-box;padding:4vmin;font-size:4vmin;color:hsl(0,0%,30%)}.popBtn:last-child{border-left:.25vmin solid hsla(0,0%,0%,.3)}.popTouched{background:hsl(0,0%,90%)}.clickBg,.shadowBg{position:fixed;width:100%;height:100%;top:0;left:0;z-index:-999}.shadowBg{background:hsla(0,0%,0%,0.3);z-index:988}</style>").appendTo("head");
      $popWrapper = $('<div style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:999"></div>').attr("id", "idpPopMsg").appendTo("body");
      $("<div/>").addClass("popMsg-clickBg").appendTo("body");
      $("<div/>").addClass("popMsg-shadowBg").appendTo("body");
    } else {
      $popWrapper = $("#idpPopMsg").empty();
    }
    $popShadow = $(".popMsg-shadowBg").css("display", "none");
    //
    $popMain = $("<div/>").addClass(settings.class).css("display", "none");
    $("<div/>").addClass("popContext").html(settings.message).appendTo($popMain);
    if (settings.type == "trolley") {
       $popMain.addClass("popMsgTrolley");
       $close = $("<div id='popMsgClose2'><img src='" + host + "/images/public/close2.png'></div>");
       $close.appendTo($popMain);
       $popMain.find(".popContext").text("添加购物车成功").append(
        $("<div id='popContextImg'><img src='" + host + "/images/public/trolleyEmpty.png'></div>")
        );
       $btn = $close;
    } else {
      if (settings.choice) {
        $no = $("<div/>").attr("id", "popCancel").addClass("popBtn").text(settings.cancel).appendTo($popMain);
        $yes = $("<div/>").attr("id", "popConfirm").addClass("popBtn").text(settings.confirm).appendTo($popMain);
        $btn = $no.add($yes);
      } else {
        $("<div id='popMsgClose'><img src='" + host + "/images/public/popMsgClose.png'></div>").appendTo($popMain);
        $yes = $("<div/>").attr("id", "popOnlyConfirm").addClass("popBtn").text(settings.confirm).appendTo($popMain);
        $btn = $yes;
      }
    }
    $popMain.appendTo($popWrapper).fadeIn(200);
    $popShadow.fadeIn(200);
    //
    function popClose() {
      $popMain.fadeOut(200);
      $popShadow.fadeOut(200);
    }
    if (settings.choice) {
      $btn.on("touchstart", function() {
        $(this).addClass("popTouched");
      });
      $btn.on("touchend", function() {
        $(this).removeClass("popTouched");
      });
      $yes.on("touchend", function() {
        settings.call();
				popClose()
      });
    } else {
      $btn.on("touchstart", function() {
        $(this).addClass("popTouched");
      });
      $btn.on("touchend", function() {
        $(this).removeClass("popTouched");
      });
    }
    if (settings.type=="trolley") {
      $btn.on("touchstart", function() {
        $(this).addClass("popTouched");
      });
      $btn.on("touchend", function() {
        $(this).removeClass("popTouched");
        popClose();
        $("#idpPopMsg,.popMsg-shadowBg,.popMsg-clickBg").remove();
      });
    }
    setTimeout(function() {
      function toggleMsg2() {
        setTimeout(function() {
          popClose();
          $("body").off("touchstart mousedown", toggleMsg);
          $("body").off("touchmove touchend mousemove mouseup", toggleMsg2);
        }, 150);
      };
      function toggleMsg(e) {
        // console.log(e.target);
        if ($(e.target).parents("#idpPopMsg").length == 0) {
          $("body").on("touchmove touchend mousemove mouseup", toggleMsg2);
        }
        var strId = $(e.target).attr("id");
        if ((strId == "popCancel") || (strId == "popOnlyConfirm") || ($(e.target).parents("#popMsgClose").length != 0)) {
          $("body").on("touchend mouseup", toggleMsg2);
        }
      };
      $("body").on("touchstart mousedown", toggleMsg);
    }, 0);
  },
  hide: function() {
    if ($("#idpPopMsg").length) {
      $("#idpPopMsg").children().fadeOut(200);
    }
  }
};

function popMsg3() {
  // settings
  var settings = $.extend({
    "type": "", // trolley, choice, confirm, none
    "message": "弹窗内容",
    "template": ['<div></div>'], //模板
    "action": {},
    "transition": "300", //动画时间
    "duration": "0", //延迟隐藏 0为不隐藏
  }, arguments[0]);
  settings.duration = toMs(settings.duration);
  // 默认模板
  var tempTrolley = [
    '<div class="popTrolley">',
    '<div class="wrapperClose" data-action="doClose">',
    '<icon class="iClose"></icon>',
    '</div>',
    '<div class="popContent">',
    '<span class="textMsg">添加购物车成功</span>',
    '<div class="imgTrolleyEmpty"></div>',
    '</div>',
    '</div>',
  ];
  var tempChoice = [];
  var tempConfirm = [];
  var tempNone = [];
  // 默认行为
  var actionTrolley = {
    "[data-action='doClose']": doClose
  }

  function doClose() {
    hidePop();
  }
  // 处理模板
  if (settings.type.length) {
    settings.template = (function(type) {
      switch (type) {
        case "trolley":
          return tempTrolley;
        case "choice":
          return tempChoice;
      }
    })(settings.type);
  } else {}
  settings.template = settings.template.join("\n");
  // 处理行为
  if (settings.type.length) {
    settings.action = (function(type) {
      switch (type) {
        case "trolley":
          return actionTrolley;
        case "choice":
          return actionChoice;
      }
    })(settings.type);
  }
  //建立DOM cache
  var $pMain = $("<div id='popMsgMain'></div>").addClass(settings.class);
  var $pContainer = $("<div id='popMsgContainer'></div>");
  var $pMask = $("<div id='PopMsgMask'></div>");
  $pMask.appendTo($pMain);
  $pContainer.appendTo($pMain).html(settings.template);
  // 显示到页面
  (function showPop() {
    if (!$("#idpPopMsg").length) {
      renderMain();
    } else {
      emptyMain();
    }
  })();
  //绑定行为
  var listEvent = [];
  $pMask.on("click touchstart", function() {
    hidePop();
  });
  $pMain.on("touchmove", function() {
    hidePop();
  });
  listEvent.push($pMask,$pMain);
  for (var i in settings.action) {
    var $ele = $("#popMsgMain").find(i);
    listEvent.push($ele);
    $ele.on("click", function() {
      settings.action[i]();
    });
  }

  function hidePop() {
    $pMain.css({ "opacity": 0 });
    $pMask.css({ "pointer-events": "none" });
    setTimeout(function() {
      $pMain.remove();
    }, 301);
    offAction();
  };
  //
  function renderMain() {
    $pMain.css({ "opacity": 0 }).appendTo("body");
    setTimeout(function() {
      $pMain.css({ "opacity": 1 });
    }, 0);
  };

  function emptyMain() {
    $pContainer.empty()
  };
  // 解绑行为
  function offAction() {
    for (var e in listEvent) {
      listEvent[e].off();
    }
    listEvent = [];
  }
}