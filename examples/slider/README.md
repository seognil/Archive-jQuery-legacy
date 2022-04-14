# slider

## 用例

```
<div class="sliderDemo">
  <div data-src="http://cdn.akamai.steamstatic.com/steam/apps/241320/ss_8276fd1d4ac916af3a30f237f581a3c63d88f20c.1920x1080.jpg" data-url="http://store.steampowered.com/app/241320/Ittle_Dew/"></div>
  <div data-src="http://cdn.akamai.steamstatic.com/steam/apps/210970/ss_fabb0939200a1f2bbb40b775c8e07645f21dc44a.1920x1080.jpg" data-url="http://store.steampowered.com/app/210970/The_Witness/"></div>
  <div data-src="http://cdn.akamai.steamstatic.com/steam/apps/219890/ss_62a1e3085fee312cf6c1025ec89018fa98821d99.1920x1080.jpg" data-url="http://store.steampowered.com/app/219890/Antichamber/"></div>
</div>
```

```
$(".sliderDemo").iSlider({
  "dots": true,
  "transition": "700ms",
  "delay": "2000ms",
  "timing": "cubic-bezier(0.5, 0, 0.5, 1)",
  "next": "right",
  "dragable": true,
  "jumper": function (url) {
    openPage({
      "url": url
    })
  }
});

function openPage(param) {
  var urlStr = param.url + "?"
  for (var key in param.param) {
    urlStr += key + "=" + param.param[key] + "&"
  }
  urlStr = urlStr.substring(0, urlStr.length - 1)
  window.location.href = urlStr;
}
```

```less
.sliderDemo {
  max-width: 640px;
  .slider-wrapper {
    padding-bottom: 900%/16;
    .slider-unit {
      background-size: cover;
    }
  }
  .dots-container {
    right: 40px;
    bottom: 10px;
    .dots-wrapper {
      .dots-unit {
        width: 20px;
        height: 20px;
        border-width: 3px;
      }
    }
  }
}
```

## 依赖

- jQuery.js
- slider.js
- slider.css

## 结构

```
.sliderDemo

  .slider-wrapper
    .slider-unit
  .dots-container
    .dots-wrapper
      .dots-unit

```

## 参数

| 属性       | 类型     | 默认值          | 可选值                    | 说明                                                           |
| :--------- | :------- | :-------------- | :------------------------ | :------------------------------------------------------------- |
| delay      | String   | "3000ms"        |                           | 自动滚动到下一张的延迟                                         |
| transition | String   | "500ms"         |                           | 滚动渐变时间                                                   |
| speed      | String   | "ease-in-out"   |                           | 动画速度函数                                                   |
| loop       | String   | "continue"      | "continue"&#124;"restart" | 最后一张结束后同方向播放到第一张，还是反向滚回第一张           |
| next       | String   | "right"         | "left"&#124;"right"       | 滚动方向                                                       |
| dots       | Boolen   | true            |                           | 是否有导航原点                                                 |
| hover      | String   | "stop"          | "stop"&#124;"continue"    | 当 hover 时，暂停轮播或不暂停                                  |
| dragable   | Boolen   | true            |                           | 轮播是否允许手指左右拖动                                       |
| scrollable | Boolen   | true            |                           | 拖动时是否允许页面垂直滚动                                     |
| dragRange  | String   | "50"            |                           | 拖动死区（只支持像素值），判断重新对齐当前图片还是拖动到下一张 |
| jumper     | Function | function(url){} |                           | 链接跳转，url==获取到的当前图片的跳转地址                      |
| dragable   | Boolen   | true            |                           | 是否可垂直拖动（mobile 性能）                                  |

## 版本

#### 2.0(developing)

- 增加了太多新功能，计划整体重构
- 修复一些遗留问题

#### 1.2

- 增加点击跳转事件

#### 1.1

- 拦截页面垂直滚动（可选）

#### 1.0

- 基础轮播
- 图片懒加载
- 可点击和拖动
- 导航圆点
- 过量拖动保护
