<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Map as LeafletMap,
  LatLng,
  TileLayer,
  Polyline,
  FeatureGroup,
} from "leaflet";
import { Flight } from "@/shared/Flight";

export default defineComponent({
  data(): {
    zoom: number;
    center: LatLng;
    map: LeafletMap | undefined;
    polylines: FeatureGroup | undefined;
  } {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: undefined,
      polylines: undefined,
    };
  },
  props: {
    flights: {
      default: () => [] as Flight[],
      type: Array,
    },
  },
  watch: {
    flights(flights: Flight[]) {
      if (!this.map) return;

      if (this.polylines) {
        this.polylines.remove();
      }

      this.polylines = new FeatureGroup<Polyline>();
      for (const flight of flights) {
        const coords = flight.traces.map((t) => new LatLng(t.lat, t.lon));
        const polyline = new Polyline(coords, {
          className: `polyline_${flight._id}`,
          color: "blue",
          weight: 3,
        });
        this.polylines.addLayer(polyline);
      }
      // Render polylines in Leaflet
      this.polylines.addTo(this.map as LeafletMap);

      this.map.fitBounds(this.polylines.getBounds());
    },
  },
  mounted() {
    this.map = new LeafletMap("leaflet", {
      //renderer: new Canvas(),
      zoomControl: false,
    });
    this.map.setView(this.center, this.zoom);

    const stamenLayer = new TileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    this.map.addLayer(stamenLayer);
  },
  beforeUnmount() {
    this.map?.remove();
  },
});
</script>

<style scoped></style>
