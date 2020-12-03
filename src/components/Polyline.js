import { defineComponent, toRefs, toRaw } from 'vue'
import { useSetupMapComponent } from '../utils/useMapComponents'
import { polylineEvents } from '../utils/events'

export default defineComponent({
  props: {
    options: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup (props, { emit }) {
    const { options, index } = toRefs(props)
    const value = toRaw(options.value)
    const polyline = useSetupMapComponent('Polyline', polylineEvents, value, emit, index)

    return { polyline }
  },
  render: () => null
})
