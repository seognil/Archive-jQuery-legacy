(function ($) {
	$(function () {
		var Data = [
			{"name": "数据1", "desc": "描述1", "id": "数据ID1", },
			{"name": "数据2", "desc": "描述2", "id": "数据ID2", },
			{"name": "损坏数据11", "id": "数据ID11", },
			{"name": "损坏数据12", "desc": "描述12", },
			{},
		]
		var addTempEvent = function ($scope) {
			$scope.find("button").on("click", function () {
				$(".result").text("获取到了 " + $scope.data("lid"))
			})
		}
		Data.forEach(function (obj) {
			$.renderTemp({
				data: obj,
				event: addTempEvent,
				temp: ".renderTemplate",
				dest: ".renderTarget",
			})
		})
	});
})(jQuery);