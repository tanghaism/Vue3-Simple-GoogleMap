<template>
  <div>
    <div ref="markerRef">
      <slot name="labelContent"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import { ref, toRefs, provide, onMounted, onBeforeUnmount } from 'vue'
  import markerWithLabelFunc from 'markerwithlabel'
  import { markerEvents } from '../utils/events'
  export default {
    name: 'slot-marker',
    props: {
      options: {
        default: () => ({}),
        type: Object
      },
      index: {
        default: 0,
        type: Number
      }
    },
    setup (props, context) {
      const { options, index } = toRefs(props)
      const markerWithLabel = ref(null)

      const marker = ref(null)
      const markerRef = ref(null)
      let _component = null
      provide('$marker', { marker })

      const createMarker = (trigger) => {
        if (window.$mapInstance && window.$mapApi) {
          if (context.slots.labelContent && context.slots.labelContent.length === 1 && context.slots.labelContent[0]) {
            options.value = Object.assign({}, options.value, { labelContent: markerRef.value })
          }
          const value = Object.assign(Object.assign({}, options.value), { map: window.$mapInstance })
          const el = markerRef.value
          el.parentNode.removeChild(el)
          const MarkerWithLabel = markerWithLabelFunc(window.$mapApi)
          marker.value = _component = new MarkerWithLabel(value)
          markerEvents.forEach(event => {
            _component && _component.addListener(event, (el) => context.emit(event, el, marker.value, index.value))
          })
          if (window.$markerArray.MarkerWithLabel) {
            window.$markerArray.MarkerWithLabel.push(_component)
          } else {
            window.$markerArray.MarkerWithLabel = [_component]
          }
        }
      }

      const removeMarker = () => {
        if (_component) {
          window.$mapApi && window.$mapApi.event.clearInstanceListeners(_component)
          _component.setMap(null)
          window.$markerArray.MarkerWithLabel && window.$markerArray.MarkerWithLabel.length > 0 && window.$markerArray.MarkerWithLabel.splice(index, 1)
        }
      }

      onMounted(() => {
        createMarker('onMounted')
      })

      onBeforeUnmount(() => {
        removeMarker()
      })

      // watch([() => map.value, options], ([newMap, newOptions], [oldMap, oldOptions], onInvalidate) => {
      //   createMarker('watch')
      //   onInvalidate(() => {
      //     removeMarker()
      //   })
      // })

      return {
        marker,
        markerRef,
        markerWithLabel,
        createMarker,
        removeMarker
      }
    }
  }
</script>

<style scoped>

</style>
