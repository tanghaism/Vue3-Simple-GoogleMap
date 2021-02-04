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
        if (window.$simpleMarkerArray[componentName]) {
          window.$simpleMarkerArray[componentName].push(_component)
        } else {
          window.$simpleMarkerArray[componentName] = [_component]
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
        window?.$simpleMarkerArray[componentName]?.length > 0 && window?.$simpleMarkerArray[componentName]?.splice(index, 1)
      }
      api.value?.event.clearInstanceListeners(_component);
      _component?.setMap(null)
    }
  })

  return { component }
}
