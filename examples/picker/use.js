(function ($) {
	$(function () {

		var d1 = Date.now()
		var nextInputStart1 = []
		var s1 = []
		for (var i = 0; i < 7; i++) {
			var di = new Date(d1 + i * 1000 * 3600 * 24)
			s1.push(di.getFullYear() + "-" + di.getMonth() + "-" + di.getDate())
		}
		$(".triggerBtn1").tap(function () {
			iPicker({
				source: s1,
				startWith: nextInputStart1,
				callback: function (index, value) {
					$(".result").html("index: " + JSON.stringify(index) + "; value: " + JSON.stringify(value))
					nextInputStart1 = index
				}
			})
		})

		var nextInputStart2 = []
		$(".triggerBtn2").tap(function () {
			iPicker({
				source: [["0","1","2","3","4","5","6","7","8","9","10","11",],["10","20","30","40","50",]],
				startWith: nextInputStart2,
				callback: function (index, value) {
					$(".result").html("index: " + JSON.stringify(index) + "; value: " + JSON.stringify(value))
					nextInputStart2 = index
				}
			})
		})

		var source3
		$.getJSON("DivisionCodeSH.v3.min.json", function (data) {
			source3 = data
		})
		var nextInputStart3 = []
		$(".triggerBtn3").tap(function () {
			iPicker({
				source: source3,
				// startWith: nextInputStart3,
				callback: function (index, value) {
					$(".result").html("index: " + JSON.stringify(index) + "; value: " + JSON.stringify(value))
					nextInputStart3 = index
				}
			})
		})
	});
})(jQuery);