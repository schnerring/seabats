<template>
  <div id="traceMap"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Map, LatLng, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  data() {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: {} as Map,
    };
  },
  mounted() {
    this.map = new Map("traceMap");
    this.map.setView(this.center, this.zoom);
    const osmLayer = new TileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    this.map.addLayer(osmLayer);
  },
  beforeUnmount() {
    this.map.remove();
  },
});
</script>

<style scoped>
#traceMap {
  flex-grow: 1;
}
</style>
