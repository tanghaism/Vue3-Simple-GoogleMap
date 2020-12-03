<template>
  <div ref="controlRef"><slot /></div>
</template>

<script>
import { defineComponent, watch, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMap } from '../utils/useMap'
export default defineComponent({
  props: {
    position: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true,
      default: 0
    }
  },
  setup (props) {
    const { map, api } = useMap()
    const controlRef = ref(null)

    const createControl = (trigger) => {
      if (map.value && api.value) {
        if (props.index) {
          controlRef.value.index = props.index
        }
        if (controlRef.value) {
          map.value.controls[api.value.ControlPosition[props.position]].push(controlRef.value)
          if (trigger === 'watch') {
            controlRef.value.parentNode.removeChild(controlRef.value)
          }
        }
      }
    }

    const removeControl = (oldIndex) => {
      if (map.value && api.value && controlRef.value) {
        let index = 0
        // Not a native array so we have to iterate using forEach of MVCArray:
        // https://developers.google.com/maps/documentation/javascript/reference/event?hl=en#MVCArray
        map.value.controls[api.value.ControlPosition[props.position]] && map.value.controls[api.value.ControlPosition[props.position]].forEach((c, i) => {
          if (c === controlRef.value) {
            index = i
          }
        })
        map.value.controls[api.value.ControlPosition[props.position]].removeAt(index)
      }
    }

    onMounted(() => {
      createControl('onMounted')
    })

    onBeforeUnmount(() => {
      removeControl(props.index)
    })

    watch([map, () => props.position, () => props.index], (_, oldValues, onInvalidate) => {
      createControl('watch')
    })
    return { controlRef }
  }
})
</script>
