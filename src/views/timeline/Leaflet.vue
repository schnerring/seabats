<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import {
  Map as LeafletMap,
  TileLayer,
  geoJSON,
  GeoJSON,
  Canvas,
} from "leaflet";
import { Feature, MultiPoint } from "geojson";
import { Flight } from "@/models/Flight";

import {
  lineStyle,
  lineStyleHighlighted,
  initialCenter,
  initialZoom,
} from "@/shared/LeafletConfig";
import { getZones } from "@/shared/DataService";

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
    ...mapState(["flights"]),
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
    flights(flights: Feature<MultiPoint, Flight>[]) {
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
        this.map?.addLayer(data);
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
  },
  async mounted() {
    this.map = new LeafletMap("leaflet", {
      renderer: new Canvas(),
      zoomControl: false,
      attributionControl: false,
    });

    this.map.setView(initialCenter, initialZoom);

    const tileLayer = new TileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    );
    this.map.addLayer(tileLayer);

    // TODO move to store
    for (const zone of await getZones()) {
      this.map.addLayer(
        geoJSON(zone, {
          style: {
            weight: zone.properties?.type === "sar" ? 2 : 1,
            color: zone.properties?.color,
            stroke: false,
            dashArray: zone.properties?.type === "sar" ? "5, 5" : "5, 10",
          },
        })
      );
    }
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
