$.renderTemp = function (options) {
    setting = $.extend({
        temp: undefined,
        dest: undefined,
        data: {},
        event: undefined,
        fill: true,
    }, options)
    var domStr = "" + $(setting.temp).html()

    function fillData(e, d) {
        return e.replace(/\$\{([^\{^\}]*)\}/g, function (match, r) {
            if (!setting.fill) {
                return match
            }
            return d[r] || match + "?"
        })
    }
    var domStr = fillData(domStr, setting.data)


    var $new = $(domStr)
    if (typeof setting.event == "function") {
        setting.event($new)
    }
    $new.appendTo(setting.dest)
}