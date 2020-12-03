<template>
  <div>
    <h1 style="text-align: center">仅支持展示单地图</h1>
    <div>
      <GoogleMap
        api-key=""
        libraries="places"
        language="en"
        v="3.41"
        :center="{ lat: -37.846382, lng: 145.068663 }"
        :zoom="11"
        :disableDefaultUI="true"
        :scrollwheel="true"
        :zoomControl="true"
        :scaleControl="false"
        :rotateControl="false"
        :panControl="false"
        :mapTypeControl="false"
        :streetViewControl="false"
        :fullscreenControl="true"
        @mapReady="onMapReady"
        style="height: 600px">
        <MarkerWithLabel :options="item" :index="index" @click="handleClick" v-for="(item, index) in marker" :key="index" >
          <template #labelContent>
            {{item.labelContent}}
          </template>
          <InfoWindow :options="item.infoWindow" :index="index" :show="item.showInfoWindow" @closeclick="item.showInfoWindow = false">
            <span>{{item.infoWindow.content}}</span>
          </InfoWindow>
        </MarkerWithLabel>
        <Polyline :options="item" :index="index" v-for="(item, index) in poyline" :key="index"/>
        <CustomControl class="bg-box"  position="LEFT_CENTER" :index="0">
          <span>自定义组件</span>
        </CustomControl>
      </GoogleMap>
    </div>
  </div>
</template>

<script>
  import { GoogleMap, InfoWindow, Polyline, MarkerWithLabel, CustomControl } from '/@/index.js'
  import icon from './marker-user.png'
  import { ref } from 'vue'
  export default {
    name: '_example',
    setup (props) {
      const marker = ref([])
      const poyline = ref([])

      const onMapReady = ({ api, map }) => {
        poyline.value = [
          {
            path: [
              { lat: -37.808585, lng: 144.960489 },
              { lat: -37.632243, lng: 144.960489 }
            ],
            strokeOpacity: 1,
            icons: [{
              icon: {
                path: api.SymbolPath.FORWARD_OPEN_ARROW,
                strokeOpacity: 1,
                strokeWeight: 2
              },
              offset: '100%'
            }],
            strokeColor: 'red',
            strokeWeight: 2,
            map: map
          }
        ]
        marker.value = [{
          icon: {
            url: icon,
            size: new api.Size(36, 36),
            scaledSize: new api.Size(36, 36),
            origin: new api.Point(0, 0),
            anchor: new api.Point(18, 36)
          },
          position: new api.LatLng(-37.808585, 144.960489),
          draggable: false,
          raiseOnDrag: false,
          labelContent: 'slot插槽marker',
          map: map,
          labelAnchor: new api.Point(60, 54),
          labelClass: 'deliveryman-label',
          labelInBackground: false,
          showInfoWindow: false,
          infoWindow: {
            maxWidth: 200,
            content: '这是infoWindow'
          }
        }]
      }

      return {
        marker,
        poyline,
        onMapReady,
        handleClick (el, _marker, index) {
          marker.value[index].showInfoWindow = true
        },
        handleClose () {
          marker.value = []
        }
      }
    },
    components: {
      GoogleMap,
      InfoWindow,
      Polyline,
      MarkerWithLabel,
      CustomControl
    }
  }
</script>

<style>
.btn-list{
  display: flex;
  width: 300px;
  font-size: 14px;
  line-height: 24px;
}
.btn-list li{
  flex: 1;
  text-align: center;
}
.bg-box{
  margin: 10px;
  width: 60px;
  height: 200px;
  border-radius: 2px;
  writing-mode:vertical-lr;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.3) 0 1px 4px -1px;
  text-align: center;
  line-height: 60px;
  font-size: 24px;
  overflow: hidden;
}
.deliveryman-label {
  background-color: #ffffff;
  border: 1px solid #ff0000;
  border-radius: 2px;
  color: #ff0000;
  text-align: center;
  width: 120px;
  line-height: 1.2;
}
</style>
