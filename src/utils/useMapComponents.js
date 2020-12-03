import { onBeforeUnmount, ref, toRaw } from 'vue'
import { useMap } from './useMap'

export const useSetupMapComponent = (
  componentName,
  events,
  options,
  emit,
  index
) => {
  const component = ref(null)
  let _component = null
  const { map, api, markerArray } = useMap()

  if (map.value && api.value) {
    component.value = _component = new api.value[componentName]({
      ...toRaw(options),
      map: map.value
    })

    events.forEach(event => {
      // eslint-disable-next-line no-unused-expressions
      _component?.addListener(event, (el) => emit(event, el, _component, index))
    })
    if (markerArray[componentName]) {
      markerArray[componentName].push(_component)
    } else {
      markerArray[componentName] = [_component]
    }
  }

  onBeforeUnmount(() => {
    if (_component) {
      // eslint-disable-next-line no-unused-expressions
      api.value?.event.clearInstanceListeners(_component)
      _component.setMap(null)
      markerArray[componentName] && markerArray[componentName].length > 0 && markerArray[componentName].splice(index, 1)
    }
  })

  return { component }
}
