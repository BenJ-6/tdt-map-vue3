<template>
  <div class="mapDiv">
    <tdt-map :center="state.center" :zoom="state.zoom">
      <tdt-tilelayer :url="state.url" :zIndex="1"></tdt-tilelayer>
    </tdt-map>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

defineOptions({
  name: "demo-tilelayer"
});
const state = reactive({
  center: [113.280637, 23.125178],
  zoom: 11,
  url: "https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=821dea15026e59e7a206977b250bdae1"
});
</script>

<style scoped>
.mapDiv {
  width: 100%;
  height: 300px;
}
</style>
