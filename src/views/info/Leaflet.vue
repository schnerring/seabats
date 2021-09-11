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
          color: "#1148fe",
          weight: 2,
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
      attributionControl: false,
      keyboard: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    });
    this.map.setView(this.center, this.zoom);

    const stamenLayer = new TileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    );
    this.map.addLayer(stamenLayer);
  },
  beforeUnmount() {
    this.map?.remove();
  },
});
</script>

<style scoped></style>
