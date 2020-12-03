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
import { useMap } from "../utils/useMap";
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
    const { map, api, markerArray } = useMap()

    const markerWithLabel = ref(null)

    const marker = ref(null)
    const markerRef = ref(null)
    let _component = null
    provide('$marker', { marker })

    const createMarker = (trigger) => {
      if (map.value && api.value) {
        if (context.slots.labelContent && context.slots.labelContent.length === 1 && context.slots.labelContent[0]) {
          options.value = Object.assign({}, options.value, { labelContent: markerRef.value })
        }
        const value = Object.assign(Object.assign({}, options.value), { map: map.value })
        const el = markerRef.value
        const MarkerWithLabel = markerWithLabelFunc(api.value)
        el.parentNode.removeChild(el)
        marker.value = _component = new MarkerWithLabel(value)
        markerEvents.forEach(event => {
          _component && _component.addListener(event, (el) => context.emit(event, el, marker.value, index.value))
        })
        if (markerArray.MarkerWithLabel) {
          markerArray.MarkerWithLabel.push(_component)
        } else {
          markerArray.MarkerWithLabel = [_component]
        }
      }
    }

    const removeMarker = () => {
      if (_component) {
        api.value?.event.clearInstanceListeners(_component)
        _component.setMap(null)
        markerArray.MarkerWithLabel && markerArray.MarkerWithLabel.length > 0 && markerArray.MarkerWithLabel.splice(index, 1)
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
