<template>
  <div ref="mapRef" v-bind="$attrs" class="map" :id="!newMap ? 'google-map' : ''" :style="{height: typeof height === 'number' ? (height + 'px') : height}">
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, provide, onBeforeUnmount, onMounted } from "vue";
import { Loader } from '@googlemaps/js-api-loader';
import { mapEvents } from "./utils/events";

export default {
  name: "google-map",
  emits: [...mapEvents, 'mapReady'],
  props: {
    // 开启debug模式会导致apiKey失效，开启的好处是生成实例google不会扣费，但是部分功能不可用。建议本地开发时可以考虑开启。
    debug: Boolean,
    // 全局单例地图实例key, 默认值$simpleMapInstance，初始化全局单例模式之后，此值不可改变。
    // 如需要在业务组件内获取当前地图实例（单例或多例模式均可用），可监听map-ready事件: ({map, api}) => void
    // map为地图实例，api为google.map对象
    mapInstance: {
      type: String,
      default: '$simpleMapInstance'
    },
    height: {
      default: '600px',
      type: [Number, String]
    },
    apiKey: String,
    version: String,
    libraries: Array,
    language: String,
    // 是否生成新实例
    newMap: {
      type: Boolean,
      default: false
    },
    backgroundColor: String,
    center: {
      type: Object,
      default:{ lat: 0, lng: 0 }
    },
    clickableIcons: { type: Boolean, default: undefined },
    controlSize: Number,
    disableDefaultUi: { type: Boolean, default: true },
    disableDoubleClickZoom: { type: Boolean, default: undefined },
    draggable: { type: Boolean, default: undefined },
    draggableCursor: String,
    draggingCursor: String,
    fullscreenControl: { type: Boolean, default: true },
    fullscreenControlPosition: String,
    gestureHandling: String,
    heading: Number,
    keyboardShortcuts: { type: Boolean, default: undefined },
    mapTypeControl: { type: Boolean, default: false },
    mapTypeControlOptions: Object,
    mapTypeId: {
      type: [Number, String],
    },
    maxZoom: Number,
    minZoom: Number,
    noClear: { type: Boolean, default: undefined },
    panControl: { type: Boolean, default: false },
    panControlPosition: String,
    restriction: Object,
    rotateControl: { type: Boolean, default: false },
    rotateControlPosition: String,
    scaleControl: { type: Boolean, default: false },
    scaleControlStyle: Number,
    scrollwheel: { type: Boolean, default: true },
    streetView: Object,
    streetViewControl: { type: Boolean, default: false },
    streetViewControlPosition: String,
    styles: Array,
    tilt: Number,
    zoom: {
      type: Number,
      default: 11
    },
    zoomControl: { type: Boolean, default: true },
    zoomControlPosition: String,
  },
  setup(props, { emit }) {
    const mapRef = ref(null);
    const ready = ref(false);
    const map = ref(null);
    const api = ref(null);
    provide('map', map);
    provide('api', api);
    provide('newMap', props.newMap)

    const resolveOptions = () => {
      const opts = {
        backgroundColor: props.backgroundColor,
        center: props.center,
        clickableIcons: props.clickableIcons,
        controlSize: props.controlSize,
        disableDefaultUI: props.disableDefaultUi,
        disableDoubleClickZoom: props.disableDoubleClickZoom,
        draggable: props.draggable,
        draggableCursor: props.draggableCursor,
        draggingCursor: props.draggingCursor,
        fullscreenControl: props.fullscreenControl,
        fullscreenControlOptions: props.fullscreenControlPosition
          ? {
              position: api.value?.ControlPosition[props.fullscreenControlPosition],
            }
          : {},
        gestureHandling: props.gestureHandling,
        heading: props.heading,
        keyboardShortcuts: props.keyboardShortcuts,
        mapTypeControl: props.mapTypeControl,
        mapTypeControlOptions: props.mapTypeControlOptions,
        mapTypeId: props.mapTypeId,
        maxZoom: props.maxZoom,
        minZoom: props.minZoom,
        noClear: props.noClear,
        panControl: props.panControl,
        panControlOptions: props.panControlPosition
          ? {
              position: api.value?.ControlPosition[props.panControlPosition],
            }
          : {},
        restriction: props.restriction,
        rotateControl: props.rotateControl,
        rotateControlOptions: props.rotateControlPosition
          ? {
              position: api.value?.ControlPosition[props.rotateControlPosition],
            }
          : {},
        scaleControl: props.scaleControl,
        scaleControlOptions: props.scaleControlStyle
          ? {
              style: props.scaleControlStyle,
            }
          : {},
        scrollwheel: props.scrollwheel,
        streetView: props.streetView,
        streetViewControl: props.streetViewControl,
        streetViewControlOptions: props.streetViewControlPosition
          ? {
              position: api.value?.ControlPosition[props.streetViewControlPosition],
            }
          : {},
        styles: props.styles,
        tilt: props.tilt,
        zoom: props.zoom,
        zoomControl: props.zoomControl,
        zoomControlOptions: props.zoomControlPosition
          ? {
              position: window.$simpleMapApi?.ControlPosition[props.zoomControlPosition],
            }
          : {},
      };

      // Strip undefined keys. Without this Map.setOptions doesn't behave very well.
      Object.keys(opts).forEach((key) => opts[key] === undefined && delete opts[key]);

      return opts;
    };

    onBeforeUnmount(() => {
      if (map.value) {
        if(!props.newMap){
          window.$simpleMapApi?.event.clearInstanceListeners(window[window.$simpleMapInstanceKey]);
        }else{
          api.value?.event.clearInstanceListeners(map.value);
        }
      }
    });

    const resetMap = (clearAll = true) => {
      if(!props.newMap){
        if (window[window.$simpleMapInstanceKey]) {
          Object.keys(window.$simpleMarkerArray).forEach((componentsKey) => {
            for (const marker of window.$simpleMarkerArray[componentsKey]) {
              try {
                window.$simpleMapApi.event.clearInstanceListeners(marker);
                marker.setMap(null);
              } catch (e) {
                console.warn(e);
              }
            }
            delete window.$simpleMarkerArray[componentsKey];
          });
          if (clearAll) {
            Object.keys(window.$simpleMapApi.ControlPosition).forEach((position) => {
              window[window.$simpleMapInstanceKey].controls[window.$simpleMapApi.ControlPosition[position]].clear();
            });
          }
        }
      }
    };

    onMounted(() => {
      // Only run this in a browser env since it needs to use the `document` object
      // and would error out in a node env (i.e. vitepress/vuepress SSR)
      if (typeof window !== "undefined") {
        const options = {
          apiKey: !props.debug ? props.apiKey : '',
          version: props.version || '3.41',
          libraries: props.libraries || ['places'],
          language: props.language || 'en'
        }
        const loader = new Loader(options);

        loader.load().then(() => {
          // 如果已存在地图实例且不生成新实例，则仍然操作单例
          if (window[window.$simpleMapInstanceKey] && window.$simpleMapDom && !props.newMap) {
            const dom = document.querySelector("#google-map");
            dom.appendChild(window.$simpleMapDom);
            window[window.$simpleMapInstanceKey].setOptions(resolveOptions());
            map.value = window[window.$simpleMapInstanceKey];
            api.value = window.$simpleMapApi;
            emit("mapReady", { map: window[window.$simpleMapInstanceKey], api: window.$simpleMapApi });
            console.log("复用地图实例");
          } else {
            // 如果不生成新实例，则生成新的单例
            if(!props.newMap){
              window.$simpleMapInstanceKey = props.mapInstance
              const { Map } = (window.$simpleMapApi = google.maps);
              window[window.$simpleMapInstanceKey] = new Map(document.querySelector("#google-map"), resolveOptions());
              const dom = document.querySelector("#google-map").childNodes[0];
              dom.style.overflow = "hidden";
              window.$simpleMapDom = dom;
              window.$simpleMarkerArray = {};
              console.log("新单例地图初始化成功");
              map.value = window[window.$simpleMapInstanceKey];
              api.value = window.$simpleMapApi;
              mapEvents.forEach((event) => {
                window[window.$simpleMapInstanceKey]?.addListener(event, () => emit(event));
              });

              ready.value = true;
              emit("mapReady", { map: window[window.$simpleMapInstanceKey], api: window.$simpleMapApi });
            }else{
              // 需要生成新的实例
              const { Map } = (api.value = google.maps);
              map.value = new Map(mapRef.value, resolveOptions());
              console.log("新地图初始化成功");

              mapEvents.forEach((event) => {
                map.value?.addListener(event, () => emit(event));
              });

              ready.value = true;
              emit("mapReady", { map: map.value, api: api.value });
            }
          }
        });
      }
    })

    return { mapRef, ready, map, api, resetMap };
  },
};
</script>

<style scoped>
.map {
  position: relative;
  width: 100%;
}
</style>
