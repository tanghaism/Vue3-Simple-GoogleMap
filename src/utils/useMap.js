import { ref, markRaw } from 'vue'

const map = ref(null)
const api = ref(null)
const markerArray = markRaw({})

export const useMap = () => {
  return { map, api, markerArray }
}
