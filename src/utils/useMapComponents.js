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
  const { map, api } = useMap()

  if (map.value && api.value) {
    component.value = _component = new window.$mapApi[componentName]({
      ...toRaw(options),
      map: window.$mapInstance
    })

    events.forEach(event => {
      // eslint-disable-next-line no-unused-expressions
      _component?.addListener(event, (el) => emit(event, el, _component, index))
    })
    if (window.$markerArray[componentName]) {
      window.$markerArray[componentName].push(_component)
    } else {
      window.$markerArray[componentName] = [_component]
    }
  }

  onBeforeUnmount(() => {
    if (_component) {
      // eslint-disable-next-line no-unused-expressions
      window.$mapApi?.event.clearInstanceListeners(_component)
      _component.setMap(null)
      window.$markerArray[componentName] && window.$markerArray[componentName].length > 0 && window.$markerArray[componentName].splice(index, 1)
    }
  })

  return { component }
}
