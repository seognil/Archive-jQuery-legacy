# render

## 用例

```
<div class="demoWrapper">
  <div class="renderDemo">
    <div class="renderTarget"></div>
    <div><br>输出：<span class="result"></span></div>
  </div>
</div>

<script type="text/template" class="renderTemplate">
    <div class="list" data="${id}">
      ${name} - ${id} - ${desc}
      <button>按钮</button>
    </div>
/script>
```

```
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
```

## 依赖

- jQuery.js
- render.js

## 参数

| 属性  | 类型            | 默认值 | 示例值             | 说明                                  |
| :---- | :-------------- | :----- | :----------------- | :------------------------------------ |
| temp  | jQuery selector |        |                    | 模板                                  |
| dest  | jQuery selector |        |                    | 目标                                  |
| data  | Object          |        |                    | 数据                                  |
| event | Function        |        | function($scope){} | 添加事件，$scope 为从模板生成的当前项 |
| fill  | Boolen          | true   |                    | 是否填充数据                          |

## 版本

#### 1.0

- script template 技术，正则替换数据，append
- 空数据保护
