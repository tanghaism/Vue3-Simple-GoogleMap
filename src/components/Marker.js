import { defineComponent, toRefs, toRaw } from 'vue'
import { useSetupMapComponent } from '../utils/useMapComponents'
import { markerEvents } from '../utils/events'

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
    const marker = useSetupMapComponent('Marker', markerEvents, toRaw(options.value), emit, index)

    return { marker }
  },
  render: () => null
})
