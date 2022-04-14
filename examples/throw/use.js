(function ($) {
	$(function () {
		$(".triggerBtn").on("click", function () {
			var $this = $(this)
			iThrow({
				thing: $this,
				from: $this,
				to: ".dest",
				duration: 500,
				size: "50%",
				angel: "2"
			})
		})
	});
})(jQuery);