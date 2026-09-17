# tdt-map-vue3

- 天地图 Vue 3 组件库

- [tdt-map-vue3 文档](https://18673107372.github.io/tdt-map-vue3/)

## 项目状态

本项目已弃用，不再继续维护。

个人在实际使用中认为这层 Vue 组件封装收益有限，更推荐直接引入天地图官方 JS API 来使用，方式更直接、排查问题也更方便。

## 推荐用法（直接加载官方 JS）

```ts
/**
 * 按需加载天地图官方 JS API v4.0 脚本。
 * 官方接入方式：<script src="https://api.tianditu.gov.cn/api?v=4.0&tk=密钥"></script>，
 * 脚本加载后在全局注入 T 命名空间（new T.Map / T.LngLat 等）。
 * 模块级缓存：整个应用只加载一次，多个地图实例共享。
 */

const SCRIPT_URL = `https://api.tianditu.gov.cn/api?v=4.0&tk=${import.meta.env.VITE_TDT_TK}`;

let loadPromise: Promise<void> | null = null;

/** 确保官方脚本已加载；重复调用（含并发）只发起一次真实请求 */
export function loadTdtScript(): Promise<void> {
  if (window.T) return Promise.resolve();
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        // 加载失败后允许下次进入地图页面时重新尝试
        loadPromise = null;
        reject(new Error("天地图 JS API 加载失败"));
      };
      document.body.appendChild(script);
    });
  }
  return loadPromise;
}
```

## 说明

fork自 [tdt-map-vue3](https://github.com/18673107372/tdt-map-vue3)

## 安装

```sh
npm i tdt-map-vue3
# or
yarn add tdt-map-vue3
```

## 快速上手

### 全局引入

全部引入，解放双手

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { install } from "tdt-map-vue3";

const app = createApp(App);
app.use(install, {
  v: "4.0", //目前只支持4.0版本
  tk: "your map token",
  plugins: ['D3', 'CarTrack'],  //需要加载的插件
  plugDomain: '' //使用自定义加载插件的域名，官方发布的插件js（未压缩）会出现https强转为http的问题，可以变相使用代理解决问题
});
app.mount("#app");
```

```html
<!-- App.vue -->
<template>
  <div class="mapDiv">
    <tdt-map :center="state.center" :zoom="state.zoom"></tdt-map>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from "vue";
  import type { LngLat } from "tdt-map-vue3";

  const state = reactive({
    center: [113.280637, 23.125178]  as LngLat,
    zoom: 12
  });
</script>

<style>
  .mapDiv {
    width: 100%;
    height: 100%;
  }
</style>
```

### 按需引入

按需引入，配合 ts 获得类型提示。

- 使用组件时传入接口参数

**`loadConfig`仅第一次生效，后续调用忽略此参数。**


```html
<!--App.vue-->
<template>
  <div class="mapDiv">
    <tdt-map :center="state.center" :zoom="state.zoom" :loadConfig="loadConfig"></tdt-map>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from "vue";
  import { TdtMap, type LngLat } from "tdt-map-vue3";

  const loadConfig = { v: "4.0", tk: "your map token" };
  const state = reactive({
    center: [113.280637, 23.125178] as LngLat,
    zoom: 12
  });
</script>

<style>
  .mapDiv {
    width: 100%;
    height: 100%;
  }
</style>
```

- 单独调用`useApiLoader`

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { useApiLoader } from "tdt-map-vue3";

const app = createApp(App);
useApiLoader( {
  v: "4.0", //目前只支持4.0版本
  tk: "your map token"
});
app.mount("#app");
```

```html
<!--App.vue-->
<template>
  <div class="mapDiv">
    <tdt-map :center="state.center" :zoom="state.zoom"></tdt-map>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from "vue";
  import { TdtMap, type LngLat } from "tdt-map-vue3";

  const state = reactive({
    center: [113.280637, 23.125178] as LngLat,
    zoom: 12
  });
</script>

<style>
  .mapDiv {
    width: 100%;
    height: 100%;
  }
</style>
```

### API 加载器

甚至可以把它当作无情的 API 加载工具

```ts
import { useApiLoader } from "tdt-map-vue3";

useApiLoader({
  v: "4.0",
  tk: "your map token",
  plugins: ["D3", "CarTrack", "HeatmapOverlay", "BufferTool", "ImageOverLayer"]
}).then(() => {
  new T.Map({ ... });
});
```

## 辅助函数

```ts
import { toLngLat, toBounds, toPoint, toIcon } from "tdt-map-vue3";
```

### 说明

| 函数名                                                | 返回值      | 描述                                                                                                                                            |
|----------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| toLngLat(lnglat:[number,number])                   | T.LngLat | 转换为经纬度对象。<br>参数说明:<br>lnglat:经纬度数组                                                                                                            |
| toBounds(bounds:[[number,number],[number,number]]) | T.Bounds | 转换为地理范围对象。<br>参数说明:<br>bounds:地理范围数组                                                                                                          |
| toPoint(point:[number,number])                     | T.Point  | 转换为像素坐标点对象。<br>参数说明:<br>point:像素坐标点数组                                                                                                         |
| toIcon(icon:IconOption\|string)                    | T.Icon   | 转换为图标对象。<br>参数说明:<br>`icon:string//图片地址` 或 `{iconUrl:string,//图片地址`<br>`iconSize:[number,number],//图片大小`<br>`iconAnchor:[number,number]//偏移}` |

## 调用原生API

由于API是通过`useApiLoader`异步加载的，所以需要在API加载完成后才能使用天地图原生的API，有以下三种方式:

- 不使用组件，只使用API加载器

```html

<template>
  <div id="mapContainer"></div>
</template>

<script>
  import { useApiLoader } from "tdt-map-vue3";
  // 加载API
  useApiLoader({
    v: "4.0",
    tk: "your map token",
    plugins: ["D3", "CarTrack", "HeatmapOverlay", "BufferTool", "ImageOverLayer"]
  }).then(() => {
    const map = new T.Map("mapContainer", { ... });
    const marker = new T.Marker({ ... });
    map.addOverLay(marker);
  });
</script>
```

- 使用组件，监听组件的初始化事件

```html

<template>
  <tdt-map @init="mapInit"></tdt-map>
</template>

<script>
  function mapInit(map) {
    // 此时原生API中的T已存在window中
    const marker = new T.Marker({ ... })
    map.addOverLay(marker);
  }
</script>
```

- 注册了组件，使用API加载器异步等待API加载完成

```js
// 不用传参数，异步等待之前注册组件时带参数加载的API加载完成
useApiLoader({}).then(() => {
  const marker = new T.Marker({ ... });
});
```
