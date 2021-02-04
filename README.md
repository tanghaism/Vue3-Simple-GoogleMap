# Vue3-Simple-GoogleMap
Web端谷歌地图组件，实现单例模式与多例模式并存，支持多地图同时展示（多例模式）

> 已内置[MarkerWithLabel组件](https://github.com/jesstelford/node-MarkerWithLabel);

## 安装方式
```shell script
## 使用yarn(推荐)
yarn add https://github.com/infinitasx/Vue3-Google-Map.git
## 使用Npm
npm install https://github.com/infinitasx/Vue3-Google-Map.git
```


## 使用方式
1、 组件全局引入(main.js)
```vue
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {GoogleMap, MarkerWithLabel, InfoWindow, Polyline} from "vue3-google-map/dist/index"


const app = createApp(App)
  .use(store)
  .use(router)
  .use(loading)

// 注册全局组件
app.component('GoogleMap', GoogleMap)
app.component('MarkerWithLabel', MarkerWithLabel)
app.component('InfoWindow', InfoWindow)
app.component('Polyline', Polyline)

app.mount('#app')
```
2、页面内引入
```vue
import {defineComponent} from "vue"
import {GoogleMap, MarkerWithLabel, InfoWindow, Polyline} from "vue3-google-map/dist/index"

export default defineComponent({
  setup(){
    return {}
  },
  components: {
    GoogleMap,
    MarkerWithLabel,
    InfoWindow,
    Polyline
  }
})
```
详细的调用案例可见 [example/](https://github.com/infinitasx/Vue3-Google-Map/tree/main/example) 文件夹

## 组件

#### GoogleMap
> 地图组件，下面列出所有子组件都应该在此组件内使用 <br/>
> 当复用单例地图组件时，一定要保证上一个单例地图组件已经被销毁，如果需要同时展示多个地图，newMap设置为true即可

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| center       |  <div style="width: 150pt">{lat: number, lng: number}</div>    |  |  是  | 地图中心点，不传入会造成地图不渲染，所以这是必传参数 |
| debug        |  boolean    |        |  否  | 建议开发环境可以考虑开启，开启后生成实例不会产生费用，但部分功能可能受到影响 |
| mapInstance  |  string     | $easiMapInstance |  否  | 单例模式下，window下的单例地图实例的键 |
| height       |  string or number    | 600px |  否  | 地图的高度，也可以通过style传入 |
| apiKey       |  string     | AIzaSyA-kLXR4obkL87dfmJq9iOjokHo93xhics |  否  | google地图的调用key |
| version      |  string     | 3.41 | 否  |google地图的Api版本 |
| libraries    |  string[]   | ['places'] |   否  | google地图的功能库 |
| language     |  string     | en    |  否  | google地图的语言 |
| newMap       |  boolean    | false |  否  | 是否创建新实例，不传或者传false，地图会操作全局单例 |

其余属性见[Google Map Api](https://developers.google.cn/maps/documentation/javascript/controls)

> 事件 <br/>

为确保操作地图时，地图已加载成功，建议在此事件中处理初始化的业务逻辑 <br/>
@mapReady: ({map, api}) => void <br/>
注：还有一种判断地图是否加载成功的方法则是判断地图组件的ready属性是否为true<br/>

其余事件见[Google Map Event Api](https://developers.google.cn/maps/documentation/javascript/events)

> 方法 <br/>

清除单例地图内的所有组件，相当于清空地图(仅对单例地图生效) <br/>
@param: clearAll 是否清除自定义组件，默认需要清除(一般情况下不需要手动调用这个方法，单例地图组件销毁时会自动清除地图上的所有组件)
```shell script
resetMap: (clearAll: boolean = true) => void
```

#### MarkerWithLabel
> 依赖于[markerwithlabel.js v2.0.2](https://github.com/jesstelford/node-MarkerWithLabel) <br/>

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| options      |  object    |        |  是  |  详细参数见[markerwithlabel.js](https://github.com/jesstelford/node-MarkerWithLabel#properties)  |
| index        |  number    |        |  是  |  marker的索引  |

| slot        |    remark      |
| :------------: | :-----------: |
| default      |  如果要使用InfoWindow，则可将InfoWindow组件写入此slot    |
| labelContent |  label文案    |

> 事件 <br/>

事件见[markerwithlabel.js](https://github.com/jesstelford/node-MarkerWithLabel#mouse-events)

> 方法 <br/>

清除当前Marker <br/>
```shell script
removeMarker: () => void
```

#### InfoWindow
> 基于 [Google Map InfoWindow Api](https://developers.google.cn/maps/documentation/javascript/infowindows) 封装

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| options      |  object    |        |  是  |  详细参数见[Google Map InfoWindow Api](https://developers.google.cn/maps/documentation/javascript/infowindows) |
| index        |  number    |        |  是  |  InfoWindow的索引(一般取父组件的索引)  |
| show         |  boolean   |        |  是  |  是否显示  |

> 事件 <br/>

infoWindow关闭事件
@close: () => void <br/>

> 方法 <br/>

显示InfoWindow <br/>
```shell script
openInfoWindow: () => void
```

关闭InfoWindow <br/>
```shell script
closeInfoWindow: () => void
```

#### Marker
> 基于 [Google Map Markers Api](https://developers.google.cn/maps/documentation/javascript/markers) 封装

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| options      |  object    |        |  是  |  详细参数见[Google Map Markers Api](https://developers.google.cn/maps/documentation/javascript/markers) |
| index        |  number    |        |  是  |  marker的索引  |

> 事件 <br/>

可选事件：['animation_changed',
        'click',
        'dblclick',
        'rightclick',
        'dragstart',
        'dragend',
        'drag',
        'mouseover',
        'mousedown',
        'mouseup',
        'draggable_changed',
        'clickable_changed',
        'cursor_changed',
        'flat_changed',
        'rightclick',
        'zindex_changed',
        'icon_changed',
        'position_changed',
        'shape_changed',
        'title_changed',
        'visible_changed']
        
#### Polygon
> 基于 [Google Map Polygon Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#polygons) 封装

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| options      |  object    |        |  是  |  详细参数见[Google Map Polygon Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#polygons) |
| index        |  number    |        |  是  |  Polygon的索引  |


#### Polyline
> 基于 [Google Map Polyline Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#polylines) 封装

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| options      |  object    |        |  是  |  详细参数见[Google Map Polyline Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#polylines) |
| index        |  number    |        |  是  |  Polyline的索引  |

#### Rectangle
> 基于 [Google Map Rectangle Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#rectangles) 封装

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| options      |  object    |        |  是  |  详细参数见[Google Map Rectangle Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#rectangles) |
| index        |  number    |        |  是  |  Rectangle的索引  |

#### Circle
> 基于 [Google Map Circle Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#circles) 封装

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| options      |  object    |        |  是  |  详细参数见 [Google Map Circle Api](https://developers.google.cn/maps/documentation/javascript/shapes?hl=en#circles) |
| index        |  number    |        |  是  |  Rectangle的索引  |

#### CustomControl
> 基于 [Google Map CustomControl Api](https://developers.google.cn/maps/documentation/javascript/controls?hl=en#CustomControls) 封装

| props        | type        | default     | required      |    remark      |
| :------------: | :-----------: | :-----------: | :-----------: | :--------------: |
| position     |  string    |        |  是  |  详细参数见[Google Map CustomControl Api](https://developers.google.cn/maps/documentation/javascript/controls?hl=en#ControlPositioning) |
| index        |  number    |        |  是  |  CustomControl的索引  |
