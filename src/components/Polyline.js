import {defineComponent, toRefs, toRaw, inject, ref, reactive} from 'vue'
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
    const { options, index } = toRefs(props);
    const newMap = inject('newMap');
    const map = inject('map', ref(null))
    const api = inject('api', ref(null))
    const value = toRaw(options.value)
    const polyline = useSetupMapComponent('Polyline', polylineEvents, value, emit, index, map, api, newMap)

    return { polyline }
  },
  render: () => null
})
