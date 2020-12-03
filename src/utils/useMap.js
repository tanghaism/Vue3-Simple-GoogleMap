import { ref, reactive } from 'vue'

const map = ref(null)
const api = ref(null)

export const useMap = () => {
  return { map, api }
}
