<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import { Map as LeafletMap, geoJSON, GeoJSON, Canvas } from "leaflet";
import { Feature } from "geojson";

import {
  lineStyle,
  lineStyleHighlighted,
  initialCenter,
  initialZoom,
  tileLayer,
  zoneStyle,
} from "@/shared/LeafletConfig";

export default defineComponent({
  data(): {
    map: LeafletMap | undefined;
    data: Map<string, GeoJSON>;
    selectedLine: GeoJSON | undefined;
  } {
    return {
      map: undefined,
      data: new Map(),
      selectedLine: undefined,
    };
  },
  props: {
    selectedLineId: {
      type: String,
    },
  },
  computed: {
    ...mapState(["flights", "zones"]),
  },
  methods: {
    ...mapActions(["getZones"]),
  },
  watch: {
    selectedLineId() {
      this.selectedLine?.remove();
      this.selectedLine = undefined;

      if (this.selectedLineId) {
        const line = this.data.get(this.selectedLineId);
        if (line) {
          const selectedLine = geoJSON(line.toGeoJSON(), {
            style: lineStyleHighlighted,
          });
          this.map?.addLayer(selectedLine);
          this.map?.fitBounds(selectedLine.getBounds().pad(0.2));
          this.selectedLine = selectedLine;
        }
      }
    },
    flights(flights: Feature[]) {
      for (const flight of flights) {
        if (typeof flight.id !== "string") throw "Flights require valid ID";

        if (this.data.has(flight.id)) {
          continue;
        }
        const data = geoJSON(flight, {
          style: lineStyle,
        });
        // Add the lines to the Typescript map
        this.data.set(flight.id, data);
        // Render the line in Leaflet
        this.map?.addLayer(data); // TODO bringToFront()
      }
      for (const flightId of this.data.keys()) {
        const existingFlight = flights.find((flight) => flight.id === flightId);
        if (existingFlight) {
          continue;
        }
        // Un-render the line from Leaflet
        this.data.get(flightId)?.remove();
        // remove the line from the Typescript Map
        this.data.delete(flightId);
      }
    },
    zones(zones: Feature[]) {
      for (const zone of zones) {
        this.map?.addLayer(
          geoJSON(zone, {
            style: zoneStyle(zone.properties?.type, zone.properties?.color),
          }) // TODO bringToBack()
        );
      }
    },
  },
  async mounted() {
    this.map = new LeafletMap("leaflet", {
      renderer: new Canvas(),
      zoomControl: false,
      attributionControl: false,
    });

    this.map.setView(initialCenter, initialZoom);

    this.map.addLayer(tileLayer());

    await this.getZones();
  },
  beforeUnmount() {
    this.map?.remove();
  },
});
</script>

<style scoped>
#leaflet {
  height: inherit;
  z-index: inherit;
}
</style>
