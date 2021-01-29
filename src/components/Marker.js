import {defineComponent, toRefs, toRaw, inject, ref, reactive} from 'vue'
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
    const { options, index } = toRefs(props);
    const newMap = inject('newMap');
    const map = inject('map', ref(null))
    const api = inject('api', ref(null))
    const marker = useSetupMapComponent('Marker', markerEvents, toRaw(options.value), emit, index, map, api, newMap)

    return { marker }
  },
  render: () => null
})
