(function ($) {
    $(function () {
        var piList = [{
                "link": "../slider/",
                "title": "轮播",
                "image": "img/slider_show.gif",
                "desc": "轮播插件，可调整一些配置，懒加载和跳转支持。",
                "stack": [
                    "jQyery",
                    "less",
                ],
                "type": "js",
            },
            {
                "link": "../throw/",
                "title": "抛物线",
                "image": "img/throw_show.gif",
                "desc": "模拟淘宝加入购物车模拟抛物线。",
                "stack": [
                    "jQuery",
                ],
                "type": "js",
            },
            {
                "link": "../picker/",
                "title": "选择器",
                "image": "img/picker_show.gif",
                "desc": "mobile端roller picker，支持动态数据。",
                "stack": [
                    "jQuery",
                    "less",
                ],
                "type": "js",
            },
            {
                "link": "../swipe/",
                "title": "侧滑",
                "image": "img/swipe_show.gif",
                "desc": "列表项侧滑面板（iOS实现不完美）",
                "stack": [
                    "jQuery",
                    "less",
                ],
                "type": "js",
            },
            {
                "link": "../render/",
                "title": "模板函数",
                "image": "",
                "desc": "js单向模板函数，可填充数据批量克隆。",
                "stack": [
                    "jQuery",
                ],
                "type": "js",
            },
            {
                "link": "http://blog.seognil.com/post/frontend/readme",
                "title": "TOC",
                "image": "img/toc_show.gif",
                "desc": "为文章生成目录，带追踪。",
                "stack": [
                    "jQyery",
                ],
                "type": "blog",
            },
            {
                "link": "http://blog.seognil.com/post/frontend/readme",
                "title": "image Lazy Load",
                "image": "img/lazy_show.gif",
                "desc": "图片懒加载",
                "stack": [
                    "jQyery",
                ],
                "type": "blog",
            },
            {
                "link": "http://blog.seognil.com/post/frontend/readme",
                "title": "图片预览",
                "image": "img/popImg_show.gif",
                "desc": "支持拖动和缩放。（有一些遗留bug）",
                "stack": [
                    "jQuery",
                ],
                "type": "blog",
            },
        ]
        piList.forEach(function (obj, i) {
            $.renderTemp({
                "temp": ".piTemp",
                "dest": ".projectWrapper",
                "data": obj,
                "event": function ($this) {
                    $this.addClass(`type${_.capitalize(obj.type)}`)
                    $this.find(".piImage").data("src", obj.image)
                    var $stack = $this.find(".piStackWrapper")
                    obj.stack.forEach(function (str) {
                        if (str.length) {
                            $(`<span class="piStackItem">${str}</span>`).appendTo($stack)
                        }
                    })
                },

            })
        })
        setTimeout(function () {
            $.each($(".projectItem"), function (i, ele) {
                var $img = $(ele).find(".piImage")
                if ($img.data("src").length) {
                    $img.css("background-image", `url(${$img.data("src")})`)
                } else{
                    $img.append(`<i class="fa fa-code" aria-hidden="true"></i>`)
                }
            })
        }, 0)
    });
})(jQuery);