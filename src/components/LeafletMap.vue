<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Canvas, Map, LatLng, TileLayer, Polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapState } from "vuex";
import { Flight } from "@/shared/Flight";

export default defineComponent({
  data() {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: {} as Map,
      polylines: [] as Polyline[],
    };
  },
  computed: {
    ...mapState(["flights"]),
  },
  watch: {
    flights(flights: Flight[]) {
      this.polylines.forEach((pl) => pl.remove());
      this.polylines = [];
      for (const flight of flights) {
        const coords = flight.traces.map((t) => new LatLng(t.lat, t.lon));
        const polyline = new Polyline(coords, {
          color: `#${flight.icao.split("").reverse().join("")}`,
        });
        this.polylines.push(polyline);
        polyline.addTo(this.map as Map);
      }
    },
  },
  mounted() {
    this.map = new Map("leaflet", { renderer: new Canvas() });
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
