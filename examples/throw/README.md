# throw

## 用例

```
<div class="throwDemo">
  <div class="triggerBtn">点击</div>
  <div class="dest"><span>目的地</span></div>
</div>
```

```
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
```

```less
@themeBlue: hsl(220, 70%, 50%);
.throwDemo {
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .triggerBtn {
    height: 36px;
    padding: 8px 32px;
    background-color: @themeBlue;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }
  .dest {
    align-self: flex-end;
    height: 100px;
    width: 100px;
    border-radius: 4px;
    border: 1px solid @themeBlue;
    color: @themeBlue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
```

## 依赖

- jQuery.js
- throw.js

## 结构

```
.throwThing
```

## 参数

| 属性     | 类型            | 默认值  | 示例值                  | 说明                                           |
| :------- | :-------------- | :------ | :---------------------- | :--------------------------------------------- |
| thing    | jQuery selector |         |                         | 要克隆的元素                                   |
| from     | jQuery selector |         |                         | 起始点（元素中心）                             |
| to       | jQuery selector |         |                         | 结束点（元素中心）                             |
| duration | Number          | 300     |                         | 毫秒数（将转换成帧数）                         |
| angel    | Number          | 1       |                         | 角度（系数，并不是真实的角度）                 |
| size     | String          | "100%"  | 0.5&#124;50%&#124;100px | 克隆的尺寸，两个值表示长度和宽度，如 "50% 30%" |
| opacity  | String          | "1 0.3" |                         | 透明度，两个值表示开始和结束                   |

## 版本

#### 1.3(developing)

- 修改抛物线算法（角度）

#### 1.2

- 完全克隆样式
- 使用 scale 重构缩放（之前是 width height）

#### 1.1

- 使用 requestAnimationFrame 重构

#### 1.0

- 点击 抛 从起点到终点
- 角度系数
- 尺寸和透明度
