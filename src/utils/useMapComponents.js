import { onBeforeUnmount, ref, toRaw, watch, onMounted } from 'vue'

export const useSetupMapComponent = (
  componentName,
  events,
  options,
  emit,
  index,
  map,
  api,
  newMap
) => {
  const component = ref(null)
  let _component = null

  const createMarker = (trigger) => {
    if (map.value && api.value) {
      component.value = _component = new api.value[componentName]({
        ...toRaw(options),
        map: map.value
      })

      events.forEach(event => {
        _component?.addListener(event, (el) => emit(event, el, _component, index))
      })
      if(!newMap){
        if (window.$markerArray[componentName]) {
          window.$markerArray[componentName].push(_component)
        } else {
          window.$markerArray[componentName] = [_component]
        }
      }
    }
  }

  onMounted(() => {
    createMarker('onMounted')
  })

  watch([map, api], () => {
    createMarker('watch')
  })

  onBeforeUnmount(() => {
    if (_component) {
      if(!newMap){
        window?.$markerArray[componentName]?.length > 0 && window?.$markerArray[componentName]?.splice(index, 1)
      }
      api.value?.event.clearInstanceListeners(_component);
      _component?.setMap(null)
    }
  })

  return { component }
}
