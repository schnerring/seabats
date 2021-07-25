<template>
  <div id="traceMap"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import L, { Map, LatLng, TileLayer, Polyline } from "leaflet";
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
    flights(newValue, oldValue) {
      this.polylines.forEach((pl) => pl.remove());
      this.polylines = [];
      this.drawTraces(newValue);
    },
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
  methods: {
    drawTraces(flights: Flight[]) {
      flights.forEach((flight) => {
        // [[1,2], [2,3], [4,5]]
        // const coords = flight.traces.map((t) => [t.lat, t.lon]);
        const coords = flight.traces.map((t) => new LatLng(t.lat, t.lon));
        const polyline = L.polyline(coords, {
          color: `#${flight.icao.split("").reverse().join("")}`,
        });
        this.polylines.push(polyline);
        polyline.addTo(this.map as Map);
      });
    },
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
