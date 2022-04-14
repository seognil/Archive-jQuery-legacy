//转换为（毫秒）数字
//输入 "3s" | "3000ms" | 3000
//输出 3000
function toMs(ele) {
	var result;
	if (typeof(ele) === "number") {
		result = ele;
	} else {
		if (ele.slice(-1) == "s") {
			if (ele.slice(-2, -1) == "m") {
				result = ele.slice(0, -2) - 0;
			} else {
				result = (ele.slice(0, -1) - 0) * 1000;
			}
		} else {
			result = ele - 0;
		}
	}
	return result;
};
//转换为（像素）数字，只支持px
//输入 "32px" | "32"
//输出 32
function toPx(ele) {
	var result;
	if (typeof(ele) === "number") {
		result = ele;
	} else {
		result = (ele.slice(-2) == "px") ? ele.slice(0, -2) - 0 : ele - 0;
	}
	return result;
};
//转换为布尔值
//输入   "on" | "off"
//      "yes" | "no"
//     "true" | "false"
//       true | false
//输出   true | false
function toBool(ele) {
	return (ele == true || ele == "yes" || ele == "true" || ele == "on") ? true : false;
};
/* 选项

 delay: "2000ms" | "2s" | 2000
 切屏间隔时间
 默认 "3000ms"

 transition: "300ms" | "0.3s" | 300
 切屏过程时间
 默认 "500ms"

 timing: "ease-in-out" | "linear" | "cubic-bezier(0, 0.5, 1, 0.5)" | 等等
 动画速度函数 transition-timing-function
 默认 "ease-in-out"

 loop: "continue" | "restart"
 播放完成后，继续顺序播放、反向滚回到第一张重新开始。
 默认 "continue"

 next: "left" | "right"
 下一张图片是左边的还是右边的
 默认 "right"

 dots: "yes" | "no" | "true" | "false" | true | false
 是否有导航原点

 dots position: bottom | top | left | right
 导航点位置

 hover: "stop" | "continue"
 当鼠标移动到框内时（未点击），停止轮播（移出后继续）或不停止。
 默认为停止

 dragable: "yes" | "no" | "true" | "false" | true | false
 框内是否允许左右拖动
 默认允许

 scrollable: 同上
 拖动时是否允许垂直滚动
 默认禁止

 dragRange: "50px" | "50" | 50
 超出拖动范围后切到隔壁图片，否则弹回当前图片
 暂时仅支持px单位，不支持%
 默认 "50px"

 scroll: yes | no
 是否拦截滚动

 */
(function($) {
	$.fn.iSlider = function(options) {
		var settings = $.extend({
			"delay": "3000ms", //
			"transition": "500ms", //
			"speed": "ease-in-out", //
			"loop": "continue",
			"next": "right", //
			"dots": "yes",
			// "dots position":         "bottom",//没做
			"hover": "stop",
			"dragable": "yes",
			"scrollable": "yes",
			"dragRange": "50px",
			"scroll": "yes",
			"jumper": function(){
				console.log(undefined)
			}
		}, options);
		// settings数据处理
		// 依赖common.js若没有请按字面意思重新搭建；
		settings.delay = toMs(settings.delay);
		settings.transition = toMs(settings.transition);
		settings.dragable = toBool(settings.dragable);
		settings.scrollable = toBool(settings.scrollable);
		settings.dots = toBool(settings.dots);
		settings.dragRange = toPx(settings.dragRange);
		//
		return this.each(function() {
			var $container = $(this).addClass("slider-container");
			var widthSlider = $container.width();
			var heightSlider = $container.height();
			var $sliderGroup = $container.children();
			var cloneRange = 2, //拖动保护，以下变量都从0开始计数
				flagPure = 0, //标记轮播到第几张图，给dots用
				flagComputed = cloneRange, //实际第几个节点，包括克隆，在start和end间
				len = $sliderGroup.length,
				flagStart = cloneRange, //原图片组起始位置
				flagEnd = cloneRange + len - 1; //原图片组结束位置
			var looper;
			var $dotsContainer, $dotsWrapper, $dotsGroup;
			//初始化
			//点初始化
			if (len == 1) {
				$sliderGroup.css({
					"background-image": "url(" + $sliderGroup.attr("data-src") + ")",
					"height": "100%",
					"width": "100%",
					"background-position": "center",
					"background-size": "cover"
				});
			} else {
				if (settings.dots) {
					$dotsContainer = $("<div/>").addClass("dots-container").appendTo($container);
					$dotsWrapper = $("<div/>").addClass("dots-wrapper").appendTo($dotsContainer);
					for (var i = len; i > 0; i--) {
						$("<div/>").addClass("dots-unit").appendTo($dotsWrapper);
					}
					$dotsGroup = $dotsWrapper.children().css({
						"transition-duration": settings.transition
					});
					$dotsGroup.eq(0).addClass("on");
				}
				//图片组初始化
				var $wrapper = $("<div/>").append($sliderGroup).prependTo($container).addClass("slider-wrapper");
				switch (settings.next) {
					case "right":
						flagComputed = flagStart;
						break;
					case "left":
						flagComputed = flagEnd;
						$sliderGroup.each(function() {
							$(this).prependTo($wrapper);
						});
						break;
				};
				$wrapper.css({ "transform": "translate3d(-" + flagComputed + "00%,0,0)" }).css({
					"transition-duration": settings.transition + "ms",
					"transition-timing-function": settings.timing
				});
				//克隆首尾图片，以保证拖动效果
				for (var i = 0; i < cloneRange; ++i) {
					$wrapper.children().eq($wrapper.children().length - len).clone().appendTo($wrapper).attr("data-mark", 'clone-1');
					$wrapper.children().eq(len - 1).clone().prependTo($wrapper).attr("data-mark", 'clone--1');
				}
				$sliderGroup = $wrapper.children();
				$sliderGroup.each(function() {
					$(this).addClass("slider-unit").css({ "left": $(this).index() + "00%" });
				});
				//塞入图片数据
				$sliderGroup.each(function() {
					if ($(this).css("background-image") == "none") {
						$(this).css("background-image", "url(" + $(this).attr("data-src") + ")");
					};
				});
				//一堆过程函数 事件的时候要调用的
				function rollEverything() {
					rollPic();
					if (settings.dots) {
						rollDots();
					}
				};
				function rollPic() {
					$wrapper.css({
						"transition-duration": settings.transition + "ms",
						"transform": "translate3d(-" + flagComputed + "00%,0,0)"
					});
				};
				function rollDots() {
					$dotsGroup.filter(".on").removeClass("on");
					$dotsGroup.eq(flagPure).addClass("on");
				};
				function setFlagPure() {
					return flagPure = (flagPure < len - 1) ? ++flagPure : 0;
				};
				function setFlagMove() {
					var option = arguments[0] || settings.next;
					if (arguments[0] == "left") option = "right";
					if (arguments[0] == "right") option = "left";
					switch (option) {
						case "right":
							flagPure = (flagPure > 0) ? --flagPure : len - 1;
							break;
						case "left":
							flagPure = (flagPure < len - 1) ? ++flagPure : 0;
							break;
						case "none":
							break;
					};
					return flagPure;
				};
				function setFlagContinue() {
					// flagComputed = flagPure + flagStart ;
					var option = arguments[0] || settings.next;
					switch (option) {
						case "right":
							flagComputed = (flagComputed < flagEnd + 1) ? ++flagComputed : flagStart + 1;
							break;
						case "left":
							flagComputed = (flagComputed > flagStart - 1) ? --flagComputed : flagEnd - 1;
							break;
						case "none":
							break;
					};
				};
				function setFlagRestart() {
					flagComputed = (settings.next == "right") ? (flagComputed + cloneRange) : (len - flagComputed + cloneRange - 1);
				};
				function CheckLast() {
					switch (settings.next) {
						case "right":
							return (flagComputed == flagEnd + 1);
						case "left":
							return (flagComputed == flagStart - 1);
					};
				};
				function ToFirst() {
					switch (settings.next) {
						case "right":
							$wrapper.css({
								"transition-duration": "0s",
								"transform": "translate3d(-" + (flagStart) + "00%,0,0)"
							});
							break;
						case "left":
							$wrapper.css({
								"transition-duration": "0s",
								"transform": "translate3d(-" + (flagEnd) + "00%,0,0)"
							});
							break;
					};
				};
				function runLoop() {
					if (settings.loop == "continue") {
						if (CheckLast()) {
							ToFirst();
						}
						setFlagPure();
						setFlagContinue();
					} else {
						flagComputed = setFlagPure();
						setFlagRestart();
					}
					setTimeout(function() {
						rollEverything();
					}, 30);
				};
				function stopLoop() {
					clearInterval(looper);
				};
				function startLoop() {
					stopLoop();
					looper = setInterval(runLoop, settings.delay);
				};
				function dragStart() {
					posStartSlider = $wrapper.css("transform").split(",")[4].replace(" ", "") - 0;
					widthSlider = $container.width();
					if (flagComputed == flagEnd + 1) {
						posStartSlider += len * widthSlider;
						flagComputed = flagStart;
					} else if (flagComputed == flagStart - 1) {
						posStartSlider -= len * widthSlider;
						flagComputed = flagEnd;
					};
					xDelta = 0
					$wrapper.css({
						"transform": "translate3d(" + posStartSlider + "px,0,0)",
						"transition": "0s"
					});
					pressed = true;
					moved = false;
					stopLoop();
				};
				// var drawFrame;
				function dragMove() {
					moved = true;
					// drawFrame = requestAnimationFrame(function() {
					$wrapper.css({
						"transform": "translate3d(" + (posStartSlider + xDelta) + "px,0,0)"
					});
					// });
				};
				function dragEnd(e) {
					if (moved) {
						// window.cancelAnimationFrame(drawFrame);
						var thisDirection = (xDelta > settings.dragRange) ? "left" : "none";
						thisDirection = (xDelta < -settings.dragRange) ? "right" : thisDirection;
						setFlagContinue(thisDirection);
						setFlagMove(thisDirection);
					}
          if (!xDelta || (xDelta < 2 && -2 < xDelta)) {
            var url = $wrapper.find("div").eq(flagComputed).data("url")
            if (url != undefined) {
              settings.jumper(url)
            }
          }

					$container.removeClass("grabbing");
					rollEverything();
					pressed = false;
					moved = false;
				};
				//开始轮播
				looper = setInterval(runLoop, settings.delay);
				//事件和控制
				if (settings.hover == "stop") {
					$container.on({
						mouseleave: function() {
							setTimeout(function() { startLoop(); });
						},
						mouseenter: function() {
							stopLoop();
						}
					});
				};
				// $(window).resize(function() {
				//     widthSlider = $container.width();
				// });
				var xStart, xDelta, xEnd;
				var posStartSlider;
				var pressed = false,
					moved = false;
				var dragRange = 50;
				if (settings.dragable) {
					$container.on({
						touchstart: function(e) {
							xStart = e.originalEvent.touches[0].clientX;
							dragStart();
						},
						mousedown: function(e) {
							$container.addClass("grabbing");
							xStart = e.clientX;
							dragStart();
						}
					}, ".slider-unit");
					if (settings.dots) {
						$dotsGroup.on({
							click: function() {
								stopLoop();
								if (CheckLast()) {
									ToFirst();
								}
								flagPure = $dotsGroup.index(this);
								flagComputed = flagPure + cloneRange;
								setTimeout(function() {
									rollEverything()
								}, 30);
								setTimeout(function() {
									startLoop()
								}, settings.delay);
							}
						});
					}
					//避免鼠标移动时选中内容
					function disableSelecting() {
						window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
					}
					$("body").on({
						touchmove: function(e) {
							if (pressed) {
								if (!settings.scrollable) e.preventDefault();
								xDelta = e.originalEvent.touches[0].clientX - xStart;
								dragMove();
							}
						},
						mousemove: function(e) {
							if (pressed) {
								if (!settings.scrollable) e.preventDefault();
								disableSelecting();
								xDelta = e.clientX - xStart;
								dragMove();
							}
						},
						touchend: function(e) {
							if (pressed) {
                dragEnd();
								startLoop();
							}
						},
						mouseup: function(e) {
							if (pressed) {
								dragEnd();
							}
						}
					});
				};
			}
		});
	};
})(jQuery);
