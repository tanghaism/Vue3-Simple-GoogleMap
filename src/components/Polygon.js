import { defineComponent, toRefs, toRaw } from 'vue'
import { useSetupMapComponent } from '../utils/useMapComponents'
import { polygonEvents } from '../utils/events'

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
    const polygon = useSetupMapComponent('Polygon', polygonEvents, toRaw(options.value), emit, index)

    return { polygon }
  },
  render: () => null
})
