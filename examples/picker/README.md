# picker

## 用例

```
<div class="pickerDemo">
  <div class="triggerWrapper">
    <div class="triggerBtn triggerBtn1">单列</div>
    <div class="triggerBtn triggerBtn2">多列</div>
    <div class="triggerBtn triggerBtn3">动态</div>
  </div>
  <div>输出：<span class="result"></span></div>
</div>
```

```

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

```

```less
.iPicker-pickerContainer.iPickerToast {
  height: 300px;
}
```

## 依赖

- jQuery.js
- jTap.js
- picker.v4.css
- picker.v4.js

## 结构

```
.iPicker-bgMask
.iPicker-pickerContainer
	.iPicker-controlContainer
		.iPicker-btnCancel
		.iPicker-btnConfirm
	.iPicker-rollerContainer
		.iPicker-slotContainer
			.iPicker-slotMask
			.iPicker-slotIndicator
			.iPicker-slotWrapper
				.iPicker-slotItem
```

## 参数

| 属性      | 类型     | 默认值             | 可选值                  | 说明                                 |
| :-------- | :------- | :----------------- | :---------------------- | :----------------------------------- |
| dataType  | String   |                    | "static"&#124;"dynamic" | 数据类型（自动判断）                 |
| slot      | Number   |                    |                         | 滚动槽列数                           |
| data      | Array    |                    |                         | 数据 必传                            |
| row       | Number   |                    |                         | 如果有则按照此参数重新设定 item 高度 |
| startWith | Array    |                    |                         | 初始选择位置 window.cache            |
| flex      | Array    | [1, 1, 1]          |                         | 每个槽的宽度占比                     |
| callback  | Function | function(result){} |                         | 回调函数                             |

## 版本

#### 5.0(developing)

- 使用函数重载重构
- 尝试使用函数式编程
- 模拟过量拖动后的力学效果

#### 4.0

- 提高拖动的用户体验
- 整体重构
- 加入动态列表

## 说明

- 已经第四版了，解决了拖动上的体验，然而结构还是很混乱。维护起来非常累。
- 至少能够正常运行，还是有一些小毛病。
- 需要学习一下更规范的开发方式！
