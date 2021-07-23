<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  height: 50vh;
  width: 100%;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";

export default defineComponent({
  data() {
    return {
      zoom: 5,
      center: new LatLng(17.385044, 78.486671),
    };
  },
  mounted() {
    const map = L.map("map").setView(this.center, this.zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  },
});
</script>
