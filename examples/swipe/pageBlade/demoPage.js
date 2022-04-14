(function ($) {
    $(function () {
        $(".pjWrapper").html(
            marked(
                $("#md").html()
            )
        )
        $('pre code').each(function (i, block) {
            // if (!$(block).parent("pre").length) {
            //     $(block).wrap("<pre></pre>")
            // }
            hljs.highlightBlock(block);
        });
        $("table").wrap(`<div class="tableWrapper"></div>`)
    });
})(jQuery);