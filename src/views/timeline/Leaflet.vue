<template>
  <div id="leaflet"></div>
  <div class="legend">
    <legend-item
      v-for="item of legendItems"
      :key="item.label"
      :color="item.color"
      :label="item.label"
      :attribution="item.attribution"
      :description="item.description"
    ></legend-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import {
  Map as LeafletMap,
  geoJSON,
  GeoJSON,
  Canvas,
  FeatureGroup,
} from "leaflet";
import { Feature } from "geojson";

import {
  lineStyle,
  lineStyleHighlighted,
  initialCenter,
  initialZoom,
  tileLayer,
  zoneStyle,
} from "@/shared/LeafletConfig";
import LegendItem from "@/components/LegendItem.vue";

export default defineComponent({
  components: {
    LegendItem,
  },
  data(): {
    map: LeafletMap | undefined;
    data: Map<string, GeoJSON>;
    selectedLine: GeoJSON | undefined;
    legendItems: {
      color: string;
      label: string;
      attribution: string;
      description: string;
    }[];
  } {
    return {
      map: undefined,
      data: new Map(),
      selectedLine: undefined,
      legendItems: [],
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
      const features = new FeatureGroup();
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
        features.addLayer(data); // TODO bringToFront()
      }
      this.map?.addLayer(features);

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
      // TODO fix code duplication
      this.legendItems = zones
        .filter((z) => z.properties?.type === "sar")
        .map((z) => {
          return {
            color: z.properties?.color,
            label: z.properties?.label,
            attribution: z.properties?.attribution,
            description: z.properties?.description,
          };
        });
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
.legend {
  bottom: 15px;
  color: var(--white);
  position: absolute;
  left: 15px;
  z-index: 500;
}
</style>
