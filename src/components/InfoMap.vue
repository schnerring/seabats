<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Map as LeafletMap, LatLng, TileLayer, Polyline } from "leaflet";

export default defineComponent({
  data(): {
    zoom: number;
    center: LatLng;
    map: LeafletMap | undefined;
    polylines: Map<string, Polyline>;
  } {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: undefined,
      polylines: new Map(),
    };
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
