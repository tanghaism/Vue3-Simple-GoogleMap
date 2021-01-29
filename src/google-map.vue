<template>
  <div ref="mapRef" v-bind="$attrs" class="map" :id="!newMap ? 'google-map' : ''">
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, provide, onBeforeUnmount } from "vue";
import { Loader } from '@googlemaps/js-api-loader';
import { mapEvents } from "./utils/events";

export default {
  name: "google-map",
  emits: [...mapEvents, 'mapReady'],
  props: {
    apiKey: String,
    version: String,
    libraries: [String ,Array],
    language: String,
    newMap: {
      type: Boolean,
      default: false
    },
    backgroundColor: String,
    center: Object,
    clickableIcons: { type: Boolean, default: undefined },
    controlSize: Number,
    disableDefaultUi: { type: Boolean, default: undefined },
    disableDoubleClickZoom: { type: Boolean, default: undefined },
    draggable: { type: Boolean, default: undefined },
    draggableCursor: String,
    draggingCursor: String,
    fullscreenControl: { type: Boolean, default: undefined },
    fullscreenControlPosition: String,
    gestureHandling: String,
    heading: Number,
    keyboardShortcuts: { type: Boolean, default: undefined },
    mapTypeControl: { type: Boolean, default: undefined },
    mapTypeControlOptions: Object,
    mapTypeId: {
      type: [Number, String],
    },
    maxZoom: Number,
    minZoom: Number,
    noClear: { type: Boolean, default: undefined },
    panControl: { type: Boolean, default: undefined },
    panControlPosition: String,
    restriction: Object,
    rotateControl: { type: Boolean, default: undefined },
    rotateControlPosition: String,
    scaleControl: { type: Boolean, default: undefined },
    scaleControlStyle: Number,
    scrollwheel: { type: Boolean, default: undefined },
    streetView: Object,
    streetViewControl: { type: Boolean, default: undefined },
    streetViewControlPosition: String,
    styles: Array,
    tilt: Number,
    zoom: Number,
    zoomControl: { type: Boolean, default: undefined },
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
              position: window.$mapApi?.ControlPosition[props.zoomControlPosition],
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
          window.$mapApi?.event.clearInstanceListeners(window.$mapInstance);
        }else{
          api.value?.event.clearInstanceListeners(map.value);
        }
      }
    });

    const resetMap = (clearAll = true) => {
      if(!props.newMap){
        if (window.$mapInstance) {
          Object.keys(window.$markerArray).forEach((componentsKey) => {
            for (const marker of window.$markerArray[componentsKey]) {
              try {
                window.$mapApi.event.clearInstanceListeners(marker);
                marker.setMap(null);
              } catch (e) {
                console.warn(e);
              }
            }
            delete window.$markerArray[componentsKey];
          });
          if (clearAll) {
            Object.keys(window.$mapApi.ControlPosition).forEach((position) => {
              window.$mapInstance.controls[window.$mapApi.ControlPosition[position]].clear();
            });
          }
        }
      }
    };

    // Only run this in a browser env since it needs to use the `document` object
    // and would error out in a node env (i.e. vitepress/vuepress SSR)
    if (typeof window !== "undefined") {
      const loader = new Loader({
        apiKey: props.apiKey,
        version: '3.41',
        libraries: ['places'],
        language: props.language || 'en'
      });

      loader.load().then(() => {
        // 如果已存在地图实例且不生成新实例，则仍然操作单例
        if (window.$mapInstance && window.$mapDom && !props.newMap) {
          const dom = document.querySelector("#google-map");
          dom.appendChild(window.$mapDom);
          window.$mapInstance.setOptions(resolveOptions());
          map.value = window.$mapInstance;
          api.value = window.$mapApi;
          emit("mapReady", { map: window.$mapInstance, api: window.$mapApi });
          console.log("复用地图实例");
        } else {
          // 如果不生成新实例，则生成新的单例
          if(!props.newMap){
            const { Map } = (window.$mapApi = google.maps);
            window.$mapInstance = new Map(document.querySelector("#google-map"), resolveOptions());
            const dom = document.querySelector("#google-map").childNodes[0];
            dom.style.overflow = "hidden";
            window.$mapDom = dom;
            window.$markerArray = {};
            console.log("地图初始化成功");
            map.value = window.$mapInstance;
            api.value = window.$mapApi;
            mapEvents.forEach((event) => {
              window.$mapInstance?.addListener(event, () => emit(event));
            });

            ready.value = true;
            emit("mapReady", { map: window.$mapInstance, api: window.$mapApi });
          }else{
            // 需要生成新的实例
            const { Map } = (api.value = google.maps);
            map.value = new Map(mapRef.value, resolveOptions());
            console.log("地图初始化成功");

            mapEvents.forEach((event) => {
              map.value?.addListener(event, () => emit(event));
            });

            ready.value = true;
            emit("mapReady", { map: map.value, api: api.value });
          }
        }
      });
    }

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
