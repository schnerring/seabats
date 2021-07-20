<template>
  <div id="map"></div>
  <AircraftList />
</template>

<style scoped>
#map {
  height: 50vh;
  width: 100%;
}
</style>

<script>
import { Options, Vue } from "vue-class-component";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AircraftList from "@/components/AircraftList.vue";

@Options({
  components: {
    AircraftList,
  },
  data() {
    return {
      zoom: 2,
      center: [17.385044, 78.486671],
    };
  },
  computed: {},
  methods: {},
  mounted() {
    const map = L.map("map").setView(this.center, this.zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  },
})
export default class LeafletMap extends Vue {}
</script>
