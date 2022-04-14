(function ($) {
	$(function () {
		var swipeEvent = {
			".panelBtn": function ($scope) {
				console.log($scope)
				$(".result").text(`你点击了第 ${$scope.index()+1} 项，列表的data是 ${$scope.data("lid")} `)
			}
		}
		$(".demoList").iSwipe({
			"slot": ".demoItem",
			"swipe": ".itemWrapper",
			"panel-right": ".swipeRightBlade",
			"event": swipeEvent,
			"able": function () {
				return true
			},
		})
	});
})(jQuery);