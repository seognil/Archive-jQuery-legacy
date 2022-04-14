function scrollAjax(options) {
	var ajaxAble = true;
	var ajaxPreDistance = 100;
	var $ajaxStatusDiv;
	var page = 0;
	function drawDefault() {
		console.log("嘿！请写个函数把获取到的数据进行dom操作");
	};
	var settings = $.extend({
		"text": "东西",
		"ajaxPreDistance": 100,
		"drawDom": drawDefault
	}, options);
	settings.ajaxPreDistance = toPx(settings.ajaxPreDistance);
	var ajaxDataStr = window.location.search;
	ajaxDataStr = (ajaxDataStr.length) ? ajaxDataStr.slice(1) + "&page=" : "page=";
	var ajaxSettings = $.extend({
		url: host,
		type: 'get',
		cache: 'false',
		dataType: 'json',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		data: ajaxDataStr + page,
		beforeSend: function() {
			ajaxLoading();
		},
		success: function(data) {
			ajaxSucceed(data);
		},
		error: function() {
			ajaxFailed();
		}
	}, options.ajaxSettings);
	//判断加载，初始化loading动画
	if (false
    // $("body").height() < $(window).height() + settings.ajaxPreDistance
  ) {
		ajaxAble = false;
	} else {
		$("<style>#ajaxStatus{padding-top:1em;padding-bottom:1em;text-align:center;color:#666666;background-color:#f5f5f5;}#ajaxLoading div{width:6vw;height:0.5vw;margin:1.5vw auto 0 auto;animation:aL1 0.8s infinite;background:#666666;}#ajaxLoading div:nth-child(2){animation-delay:0.2s;}#ajaxLoading div:nth-child(3){animation-delay:0.4s;}@keyframes aL1{50%{-webkit-transform:scale(1.5);-ms-transform:scale(1.5);transform:scale(1.5);}}</style>").appendTo("head");
		$ajaxStatusDiv = $("<div/>").attr("id", "ajaxStatus").appendTo(".content");
	}
	//添加滚动监听
	$(window).scroll(function() {
		if (ajaxAble) {
			if ($(document).scrollTop() >= $(document).height() - $(window).height() - settings.ajaxPreDistance) {
				ajaxLoad();
			}
		}
	});
	//
	function ajaxLoad() {
		ajaxSettings.data = ajaxDataStr + (++page);
		$.ajax(ajaxSettings);
	};
	function ajaxLoading() {
		ajaxAble = false;
		$ajaxStatusDiv.empty().text("正在加载更多" + settings.text);
		$("<div id='ajaxLoading'><div></div><div></div><div></div></div>").appendTo($ajaxStatusDiv);
	};
	function ajaxSucceed(data) {
		if (data.length <= 0) {
			ajaxAccomplished();
			if (page)
				--page;
		} else {
			ajaxToDom(data);
			if (data.length < 5) {
				ajaxAccomplished();
			}
		}
	};
	function ajaxToDom(data) {
		for (var i = 0; i < data.length; i++) {
			settings.drawDom(data[i]);
		};
		ajaxAble = true;
	};
	function ajaxAccomplished() {
		ajaxAble = false;
		$ajaxStatusDiv.empty().text("—— 没有更多" + settings.text + "了 ——");
		$(".content").css({
			"overflow": "auto",
			// "-webkit-overflow-scrolling": "touch"
		});
	};
	function ajaxFailed() {
		if (page)
			--page;
		popMsg("加载异常，请重新加载！");
	};
	//
};
