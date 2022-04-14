$.iPager = function (options) {
    var setting = $.extend({
        appendTo: "",
        now: 1,
        total: 1,
        event: function ($scope, result) {
            // console.log($scope, result)
        },
    }, options)
    var dom = {
        sub: [],
    }
    makeSub()

    function makeSub() {
        dom.$wrapper = $('<ul class="pagination"></ul>')
        dom.sub = []
        pusherSub("«", "pagerLeft")
        if (setting.total < 12) {
            looper(setting.total, function (i) {
                pusherItem(i)
            })
        } else {
            if (setting.now < 6) {
                looper(8, function (i) {
                    pusherItem(i)
                })
                pusherEllipsis()
                looper([setting.total - 1, setting.total], function (i) {
                    pusherItem(i)
                })
            } else if (setting.now > setting.total - 5) {
                looper(2, function (i) {
                    pusherItem(i)
                })
                pusherEllipsis()
                looper([setting.total - 7, setting.total], function (i) {
                    pusherItem(i)
                })
            } else {
                looper(2, function (i) {
                    pusherItem(i)
                })
                pusherEllipsis()
                looper([setting.now - 3, setting.now + 3], function (i) {
                    pusherItem(i)
                })
                pusherEllipsis()
                looper([setting.total - 1, setting.total], function (i) {
                    pusherItem(i)
                })
            }
        }
        pusherSub("»", "pagerRight")
        dom.$wrapper.empty().append(dom.sub.join(""))
        $(setting.appendTo).empty()
        $(setting.appendTo).append(dom.$wrapper)
        dom.$wrapper.on("click", ".pagerLeft", function () {
            if (setting.now > 1) {
                setting.now -= 1
                changePage()
            }
        })
        dom.$wrapper.on("click", ".pagerRight", function () {
            if (setting.now < setting.total) {
                setting.now -= -1
                changePage()
            }
        })
        dom.$wrapper.on("click", ".pagerItem", function () {
            if (!$(this).hasClass("pagerNow")) {
                setting.now = $(this).data("page-item")
                changePage()
            }
        })
    }

    function changePage() {
        makeSub()
        setting.event($(setting.appendTo), setting.now - 1)
    }

    function pusherItem(i) {
        pusherSub(i, "pagerItem" + ((i == setting.now) ? " pagerNow" : ""), i)
    }

    function pusherEllipsis() {
        pusherSub("...")
    }

    function pusherSub() {
        var str = arguments[0] || ""
        var className = arguments[1] || ""
        var data = arguments[2] || ""
        dom.sub.push("<li class='" + className + "' data-page-item='" + data + "'><span>" + String(str) + "</span></li>")
    }
};