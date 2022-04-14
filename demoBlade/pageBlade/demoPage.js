(function ($) {
    $(function () {
        $(".pjWrapper").html(
            marked(
                $("#md").html()
            )
        )
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    });
})(jQuery);