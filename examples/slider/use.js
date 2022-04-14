(function ($) {
	$(function () {
		$(".sliderDemo").iSlider({
			"dots": true,
			"transition": "700ms",
			"delay": "4000ms",
			"timing": "cubic-bezier(0.5, 0, 0.5, 1)",
			"next": "right",
			"dragable": true,
			"jumper": function (url) {
				openPage({
					"url": url
				})
			}
		});

		function openPage(param) {
			var urlStr = param.url + "?"
			for (var key in param.param) {
				urlStr += key + "=" + param.param[key] + "&"
			}
			urlStr = urlStr.substring(0, urlStr.length - 1)
			window.location.href = urlStr;
		}
	});
})(jQuery);