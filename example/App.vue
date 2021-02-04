<template>
  <div>
    <h1 style="text-align: center">案例1：单例模式</h1>
    <p style="text-align: center">（全局唯一地图实例,仅支持展示一个地图）</p>
    <div style="padding: 10px 0">
      <button type="button" style="margin-right: 10px" @click="toggleMap">toggle map</button>
      <button type="button" @click="resetMap(showMap ? mapRef : mapRef1)">reset map</button>
    </div>
    <div v-if="showMap">
      <GoogleMap
        ref="mapRef"
        :center="{ lat: -37.846382, lng: 145.068663 }"
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
          <span>自定义组件{{count}}</span>
        </CustomControl>
      </GoogleMap>
    </div>
    <div v-else>
      <GoogleMap
        ref="mapRef1"
        :center="{ lat: -37.846382, lng: 145.068663 }"
        style="height: 600px">
        <MarkerWithLabel :options="item" :index="index" @click="handleClick" v-for="(item, index) in marker1" :key="index" >
          <template #labelContent>
            {{item.labelContent}}
          </template>
          <InfoWindow :options="item.infoWindow" :index="index" :show="item.showInfoWindow" @closeclick="item.showInfoWindow = false">
            <span>{{item.infoWindow.content}}</span>
          </InfoWindow>
        </MarkerWithLabel>
      </GoogleMap>
    </div>

    <h1 style="text-align: center">案例2：多地图同时展示</h1>
    <p style="text-align: center">（newMap传true则会创建新的地图实例，不影响全局唯一地图实例，可同时展示多个地图，同时生成多个实例）</p>
    <p style="text-align: center">（newMap为true的地图resetMap方法无效，如果需要清空地图上的marker，只需要把传入地图的marker数组清空即可）</p>
    <p style="text-align: center">（移除自定义组件的方法见google地图Api）</p>
    <div style="position: relative;overflow: hidden">
      <div style="width: 48%;float: left">
        <GoogleMap
          ref="mapRef2"
          api-key=""
          :newMap="true"
          :center="{ lat: -37.846382, lng: 145.068663 }"
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
            <span>多地图同时展示</span>
          </CustomControl>
        </GoogleMap>
      </div>
      <div style="width: 48%;float: right">
        <GoogleMap
          ref="mapRef3"
          api-key=""
          :newMap="true"
          :center="{ lat: -37.846382, lng: 145.068663 }"
          style="height: 600px">
          <MarkerWithLabel :options="item" :index="index" @click="handleClick" v-for="(item, index) in marker1" :key="index" >
            <template #labelContent>
              {{item.labelContent}}
            </template>
            <InfoWindow :options="item.infoWindow" :index="index" :show="item.showInfoWindow" @closeclick="item.showInfoWindow = false">
              <span>{{item.infoWindow.content}}</span>
            </InfoWindow>
          </MarkerWithLabel>
        </GoogleMap>
      </div>
    </div>

  </div>
</template>

<script>
  import { GoogleMap, InfoWindow, Polyline, MarkerWithLabel, CustomControl } from '/@/index'
  import icon from './marker-user.png'
  import { ref } from 'vue'
  export default {
    name: '_example',
    setup (props) {
      const mapRef = ref(null)
      const mapRef1 = ref(null)
      const mapRef2 = ref(null)
      const mapRef3 = ref(null)
      const marker = ref([])
      const marker1 = ref([])
      const poyline = ref([])
      const showMap = ref(true)
      const count = ref(0)

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
        marker1.value = [
          {
            icon: {
              url: icon,
              size: new api.Size(36, 36),
              scaledSize: new api.Size(36, 36),
              origin: new api.Point(0, 0),
              anchor: new api.Point(18, 36)
            },
            position: new api.LatLng(-37.808485, 144.962489),
            draggable: false,
            raiseOnDrag: false,
            labelContent: '另一个地图',
            map: map,
            labelAnchor: new api.Point(60, 54),
            labelClass: 'deliveryman-label',
            labelInBackground: false,
            showInfoWindow: false,
            infoWindow: {
              maxWidth: 200,
              content: '这是infoWindow2'
            }
          }
        ]
      }

      return {
        mapRef,
        mapRef1,
        marker,
        marker1,
        mapRef2,
        mapRef3,
        poyline,
        showMap,
        count,
        onMapReady,
        handleClick (el, _marker, index) {
          marker.value[index].showInfoWindow = true
        },
        toggleMap(){
          showMap.value = !showMap.value
          if(showMap.value){
            count.value += 1
          }
        },
        resetMap(_mapRef){
          _mapRef.resetMap()
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
