$.iFilter = function (options) {

    var setting = $.extend({
        appendTo: "",
        result: "共${}张优惠券",
        data: {},
        event: function ($scope, data) {
            // console.log($scope, data)
        },
    }, options)

    var dom = {}
    var flag = {
        collecter: []
    }

    dom.$wrapper = $("<div class='iFilterWrapper'/>")
    dom.$result = setting.result.replace(/\$\{([^\{\}]*)\}/g, function (match, r) {
        return `<span class="textFilterCount">0</span>`
    })
    dom.$collect = $(`<div class="iFilterRow iFilterCollect"><div class="iFilterLabel"><span>${setting.data.label} > </span></div><div class="iFilterSubWrapper"/><div class="iFilterResult"><span>${dom.$result}<span></div></div>`).appendTo(dom.$wrapper)
    dom.$collectWrapper = dom.$collect.find(".iFilterSubWrapper")

    $.each(setting.data.row, function (i, row) {
        var $label = `<div class="iFilterLabel"><span>${row.label} : </span></div>`
        var subArray = []
        subArray.push(`<div class="iFilterSubItem iFilterItemClear iFilterSelected">全部</div>`)
        $.each(row.val, function (itemKey, itemVal) {
            subArray.push(`<div class="iFilterSubItem" data-filter-val="${itemKey}">${itemVal}</div>`)
        })
        var $row = `<div class="iFilterRow" data-filter-wrapper-index="${i}" data-filter-key="${row.key}">` + $label + `<div class="iFilterSubWrapper">` + subArray.join("") + `</div>` + `</div>`
        $($row).appendTo(dom.$wrapper)
        $(`<div class="iFilterItemWrapper"></div>`).appendTo(dom.$collectWrapper)
    })
    $(setting.appendTo).empty()
    $(setting.appendTo).append(dom.$wrapper)
    dom.$selectedWrapper = dom.$collectWrapper.find(".iFilterItemWrapper")
    dom.$row = dom.$wrapper.find(".iFilterRow").not(".iFilterCollect")
    dom.$wrapper.on("click", ".iFilterSubItem", function () {
        var $this = $(this)
        if (!$this.hasClass("iFilterSelected")) {
            var $row = $this.closest(".iFilterRow")
            var i = $row.data("filter-wrapper-index")
            dom.$selectedWrapper.eq(i).empty()
            $this.closest(".iFilterRow").find(".iFilterSubItem").removeClass("iFilterSelected")
            $this.addClass("iFilterSelected")
            if (!$this.hasClass("iFilterItemClear")) {
                dom.$selectedWrapper.eq(i).append($this.clone().append(" ×").attr("data-filter-wrapper-index", i).attr("data-filter-key", $row.data("filter-key")))
            }
        }
        callback()
    })
    dom.$selectedWrapper.on("click", ".iFilterSubItem", function () {
        var $this = $(this)
        var i = $this.data("filter-wrapper-index")
        dom.$row.eq(i).find(".iFilterSubItem").removeClass("iFilterSelected").filter(".iFilterItemClear").addClass("iFilterSelected")
        $this.remove()
        callback()
    })

    function callback() {
        var filterData = {}
        $.each(dom.$selectedWrapper.find(".iFilterSubItem"), function (i, ele) {
            var $ele = $(ele)
            filterData[$ele.data("filter-key")] = $ele.data("filter-val")

        })
        setting.event($(setting.appendTo), filterData)
    }
};