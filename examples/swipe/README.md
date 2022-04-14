# swipe

## 用例

```
<div class="swipeDemo">
  <ul class="demoList">
    <li class="demoItem" data-lid="id001"><div class="itemWrapper"><span>列表项1 试试左滑</span></div></li>
    <li class="demoItem" data-lid="id002"><div class="itemWrapper"><span>列表项2 试试左滑</span></div></li>
    <li class="demoItem" data-lid="id003"><div class="itemWrapper"><span>列表项3 试试左滑</span></div></li>
  </ul>
</div>
<div>输出：<span class="result"></span></div>

<script type="text/template" class="swipeRightBlade">
    <div class="swipeActionRight">
        <div class="panelBtn">点击</div>
    </div>
/script>
```

```
var swipeEvent = {
  ".panelBtn": function ($scope) {
    console.log($scope)
    $(".result").text(`你点击了第 ${$scope.index()+1} 项，列表的data是 ${$scope.data("lid")} `)
  }
}
$(".demoList").iSwipe({
  "slot": ".demoItem",
  "swipe": ".itemWrapper",
  "panel-right": ".swipeRightBlade",
  "event": swipeEvent,
  "able": function () {
    return true
  },
})
```

```less
@bgGray: hsl(0, 0%, 80%);
@themeBlue: hsl(220, 70%, 50%);
@themeRed: hsl(0, 70%, 50%);
.demoList {
  list-style: none;
  border: 1px solid @bgGray;
  padding: 0;
  .demoItem {
    color: white;
    .itemWrapper {
      width: 100%;
      height: 4em;
      background-color: @themeBlue;
      padding-left: 4em;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid @bgGray;
    }
    .swipeActionRight .panelBtn {
      width: 100px;
      height: 100%;
      background-color: @themeRed;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
```

## 依赖

- jQuery.js
- swipe.js

## 结构

```
.demoList
  .demoItem
    .itemWrapper
    .swipeActionRight
      .panelBtn
```

## 参数

| 属性          | 类型            | 默认值                  | 示例值                      | 说明                                                                |
| :------------ | :-------------- | :---------------------- | :-------------------------- | :------------------------------------------------------------------ |
| slot          | jQuery selector |                         |                             | 作用域，列表项的最外层                                              |
| swipe         | jQuery selector |                         |                             | 列表项中的可滑动项                                                  |
| panel-left    | jQuery selector |                         |                             | 目标模板                                                            |
| panel-right   | jQuery selector |                         |                             | 目标模板                                                            |
| deadZoneRange | Number          | 5                       |                             | touchmove 死区范围（像素），用来判断是侧滑还是正常滑动              |
| event         | Object          |                         | {".btn":function($scope){}} | 元素-事件映射，当点击对应元素时执行对应函数，$scope 将传入当前 slot |
| able          | Function        | function(){return true} | "stop"&#124;"continue"      | 判断是否开启侧滑                                                    |

## 版本

#### 1.2

- 增加是否开启侧滑的判断

#### 1.1

- 关闭 iOS overscoll 现象（iOS 端无法惯性滑动）

#### 1.0

- 判断正常滑动还是侧滑
- 动态添加删除面板
- 面板元素事件
- 自动结束滑动，增强用户体验
