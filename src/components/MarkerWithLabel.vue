<template>
  <div>
    <div ref="markerRef">
      <slot name="labelContent"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import {ref, toRefs, provide, onMounted, onBeforeUnmount, inject} from 'vue'
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
      const newMap = inject('newMap');
      const map = inject('map', ref(null))
      const api = inject('api', ref(null))
      const marker = ref(null)
      const markerRef = ref(null)
      let _component = null
      provide('$marker', { marker })

      const createMarker = (trigger) => {
        const _mapInstance = newMap ? map.value : window[window.$simpleMapInstanceKey];
        const _api = newMap ? api.value : window.$simpleMapApi;
        if (_mapInstance && _api) {
          if (context.slots.labelContent && context.slots.labelContent.length === 1 && context.slots.labelContent[0]) {
            options.value = Object.assign({}, options.value, { labelContent: markerRef.value })
          }
          const value = Object.assign(Object.assign({}, options.value), { map: _mapInstance })
          const el = markerRef.value
          el.parentNode.removeChild(el)
          const MarkerWithLabel = markerWithLabelFunc(_api)
          marker.value = _component = new MarkerWithLabel(value)
          markerEvents.forEach(event => {
            _component && _component.addListener(event, (el) => context.emit(event, el, marker.value, index.value))
          })
          if(!newMap){
            if (window.$simpleMarkerArray.MarkerWithLabel) {
              window.$simpleMarkerArray.MarkerWithLabel.push(_component)
            } else {
              window.$simpleMarkerArray.MarkerWithLabel = [_component]
            }
          }
        }
      }

      const removeMarker = () => {
        if (_component) {
          if(!newMap){
            window?.$simpleMarkerArray?.MarkerWithLabel?.length > 0 && window?.$simpleMarkerArray?.MarkerWithLabel.splice(index, 1)
          }
          api.value?.event.clearInstanceListeners(_component);
          _component?.setMap(null)
        }
      }

      onMounted(() => {
        createMarker('onMounted')
      })

      onBeforeUnmount(() => {
        removeMarker()
      })

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
