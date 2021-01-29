import {defineComponent, toRefs, toRaw, inject, ref} from 'vue'
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
    const { options, index } = toRefs(props);
    const newMap = inject('newMap');
    const map = inject('map', ref(null))
    const api = inject('api', ref(null))
    const polygon = useSetupMapComponent('Polygon', polygonEvents, toRaw(options.value), emit, index, map, api, newMap)

    return { polygon }
  },
  render: () => null
})
