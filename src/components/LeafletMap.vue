<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Canvas,
  Map as LeafletMap,
  LatLng,
  TileLayer,
  Polyline,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapState } from "vuex";
import { Flight } from "@/shared/Flight";

export default defineComponent({
  data() {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: {} as LeafletMap,
      polylines: new Map() as Map<string, Polyline>,
    };
  },
  computed: {
    ...mapState(["flights"]),
  },
  watch: {
    flights(flights: Flight[]) {
      for (const flight of flights) {
        const coords = flight.traces.map((t) => new LatLng(t.lat, t.lon));
        const polyline = new Polyline(coords, {
          color: `#${flight.icao.split("").reverse().join("")}`,
        });
        if (this.polylines.has(flight._id)) {
          continue;
        }
        this.polylines.set(flight._id, polyline);
        polyline.addTo(this.map as LeafletMap);
      }
      const polylinesToRemove = new Map<string, Polyline>();
      for (const polyline of this.polylines) {
        const key = polyline[0];
        const existingFlight = flights.find((flight) => flight._id === key);
        if (existingFlight) {
          continue;
        }
        const value = polyline[1];
        polylinesToRemove.set(key, value);
      }
      for (const polylineToRemove of polylinesToRemove) {
        const key = polylineToRemove[0];
        const value = polylineToRemove[1];
        value.remove();
        this.polylines.delete(key);
      }
    },
  },
  mounted() {
    this.map = new LeafletMap("leaflet", {
      renderer: new Canvas(),
      zoomControl: false,
    });
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
#leaflet {
  height: inherit;
  z-index: inherit;
}
</style>
