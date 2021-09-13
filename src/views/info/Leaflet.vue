<template>
  <div class="leaflet-container">
    <div id="leaflet"></div>
    <div class="tooltip-list">
      <info-tooltip
        class="tooltip-box"
        v-for="tooltipContent of tooltipContents"
        :key="tooltipContent"
        :from="tooltipContent.from"
        :to="tooltipContent.to"
        :aircraftName="tooltipContent.aircraftName"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Feature, LineString } from "geojson";
import {
  Map as LeafletMap,
  TileLayer,
  GeoJSON,
  Canvas,
  FeatureGroup,
  geoJSON,
} from "leaflet";
import InfoTooltip from "./InfoTooltip.vue";
import { Flight } from "@/models/Flight";
import dayjs from "dayjs";

import {
  initialCenter,
  initialZoom,
  lineStyleHighlighted,
} from "@/shared/LeafletConfig";
import { getZones } from "@/shared/DataService";

export default defineComponent({
  components: {
    InfoTooltip,
  },
  data(): {
    map: LeafletMap | undefined;
    data: FeatureGroup | undefined;
    tooltipContents: {
      from: Date;
      to: Date;
      aircraftName: string;
    }[];
  } {
    return {
      map: undefined,
      data: undefined,
      tooltipContents: [],
    };
  },
  props: {
    flights: {
      default: () => [] as Feature<LineString, Flight>[],
      type: Array,
    },
  },
  watch: {
    async flights(flights: Feature<LineString, Flight>[]) {
      if (this.data) {
        this.data.remove();
      }
      if (this.tooltipContents.length > 0) {
        this.tooltipContents = [];
      }
      const data = new FeatureGroup<GeoJSON>();
      for (const flight of flights) {
        this.tooltipContents.push({
          aircraftName: flight.properties.aircraft,
          from: dayjs(flight.properties.from).toDate(),
          to: dayjs(flight.properties.to).toDate(),
        });
        data.addLayer(
          geoJSON(flight, {
            style: lineStyleHighlighted,
          })
        );
      }
      // Render lines in Leaflet
      this.map?.addLayer(data);
      this.map?.fitBounds(data.getBounds().pad(0.2));

      this.data = data;
    },
  },
  async mounted() {
    this.map = new LeafletMap("leaflet", {
      renderer: new Canvas(),
      zoomControl: false,
      attributionControl: false,
      keyboard: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    });

    this.map.setView(initialCenter, initialZoom);

    const stamenLayer = new TileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    );
    this.map.addLayer(stamenLayer);

    // TODO move to store
    for (const zone of await getZones()) {
      const data = geoJSON(zone, {
        style: {
          fill: false,
          weight: zone.properties?.type === "sar" ? 2 : 1,
          color: zone.properties?.color,
          dashArray: zone.properties?.type === "sar" ? "5, 5" : undefined,
        },
      });
      this.map.addLayer(data);
    }
  },
  beforeUnmount() {
    this.map?.remove();
  },
});
</script>

<style scoped>
.tooltip-list {
  position: absolute;
  left: 15px;
  color: white;
  z-index: 500;
  top: 15px;
  font-family: monospace;
}
.leaflet-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
