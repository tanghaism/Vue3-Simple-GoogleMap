import { defineComponent, toRefs, toRaw } from 'vue'
import { useSetupMapComponent } from '../utils/useMapComponents'
import { circleEvents } from '../utils/events'

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
    const circle = useSetupMapComponent('Circle', circleEvents, toRaw(options.value), emit, index)

    return { circle }
  },
  render: () => null
})
