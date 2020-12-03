<template>
  <div ref="mapRef" id="google-map">
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
  import { ref, onBeforeUnmount } from 'vue'
  import { loadNow } from 'connect-google-maps'
  import { mapEvents } from './utils/events'
  import { useMap } from './utils/useMap'

  export default {
    name: "google-map",
    props: {
      apiKey: String,
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
        type: [Number, String]
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
      zoomControlPosition: String
    },
    setup (props, { emit }) {
      const mapRef = ref(null)
      const ready = ref(false)
      let {map, api, markerArray} = useMap()
      let mapDom = null

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
              position: api.value?.ControlPosition[props.fullscreenControlPosition]
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
              position: api.value?.ControlPosition[props.panControlPosition]
            }
            : {},
          restriction: props.restriction,
          rotateControl: props.rotateControl,
          rotateControlOptions: props.rotateControlPosition
            ? {
              position: api.value?.ControlPosition[props.rotateControlPosition]
            }
            : {},
          scaleControl: props.scaleControl,
          scaleControlOptions: props.scaleControlStyle
            ? {
              style: props.scaleControlStyle
            }
            : {},
          scrollwheel: props.scrollwheel,
          streetView: props.streetView,
          streetViewControl: props.streetViewControl,
          streetViewControlOptions: props.streetViewControlPosition
            ? {
              position: api.value?.ControlPosition[props.streetViewControlPosition]
            }
            : {},
          styles: props.styles,
          tilt: props.tilt,
          zoom: props.zoom,
          zoomControl: props.zoomControl,
          zoomControlOptions: props.zoomControlPosition
            ? {
              position: window.$mapApi?.ControlPosition[props.zoomControlPosition]
            }
            : {}
        }

        // Strip undefined keys. Without this Map.setOptions doesn't behave very well.
        Object.keys(opts).forEach(key => opts[key] === undefined && delete opts[key])

        return opts
      }

      onBeforeUnmount(() => {
        if (map.value) {
          resetMap()
          api.value?.event.clearInstanceListeners(map.value)
        }
      })

      const resetMap = () => {
        if (map.value) {
          Object.keys(markerArray).forEach(componentsKey => {
            for (const marker of markerArray[componentsKey]) {
              try {
                api.value?.event.clearInstanceListeners(marker)
                marker.setMap(null)
              } catch (e) {
                console.warn(e)
              }
            }
            delete markerArray[componentsKey]
          })
        }
      }

      // Only run this in a browser env since it needs to use the `document` object
      // and would error out in a node env (i.e. vitepress/vuepress SSR)
      if (typeof window !== 'undefined') {
        loadNow('places', props.apiKey).then(({ maps }) => {
          const dom = document.querySelector('#google-map')
          if (map.value && mapDom) {
            dom.appendChild(mapDom)
            map.value.setOptions(resolveOptions())
            console.log('复用地图实例')
          } else {
            const { Map } = (api.value = { ...maps })
            map.value = new Map(dom, resolveOptions())
            mapDom = document.querySelector('#google-map').childNodes[0]
            mapDom.style.overflow = 'hidden'
            markerArray = {}
            console.log('地图初始化成功')

            mapEvents.forEach(event => {
              map.value?.addListener(event, () => emit(event))
            })
          }
          ready.value = true
          emit('map-ready', { map: map.value, api: api.value })
        })
      }

      return { mapRef, ready, map, api, resetMap }
    }
  }
</script>

<style scoped>
#google-map{
  width: 100%;
}
</style>
