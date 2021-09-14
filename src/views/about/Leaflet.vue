<template>
  <div class="leaflet-container">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import { Feature, LineString } from "geojson";
import { Map as LeafletMap, Canvas, FeatureGroup, geoJSON } from "leaflet";
import LegendItem from "@/components/LegendItem.vue";
import { Flight } from "@/models/Flight";

import {
  initialCenter,
  initialZoom,
  tileLayer,
  zoneStyle,
} from "@/shared/LeafletConfig";

export default defineComponent({
  components: {
    LegendItem,
  },
  computed: {
    ...mapState(["zones"]),
  },
  methods: {
    ...mapActions(["getZones"]),
  },

  data(): {
    map: LeafletMap | undefined;
    legendItems: {
      color: string;
      label: string;
      attribution: string;
      description: string;
    }[];
  } {
    return {
      map: undefined,
      legendItems: [],
    };
  },
  props: {
    flights: {
      default: () => [] as Feature<LineString, Flight>[],
      type: Array,
    },
  },
  watch: {
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
      const zonesLayer = new FeatureGroup();
      for (const zone of zones) {
        zonesLayer.addLayer(
          geoJSON(zone, {
            style: zoneStyle(zone.properties?.type, zone.properties?.color),
          }) // TODO bringToBack()
        );
      }
      this.map?.addLayer(zonesLayer);
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

    this.map.addLayer(tileLayer());

    await this.getZones();
  },
  beforeUnmount() {
    this.map?.remove();
  },
});
</script>

<style scoped>
.legend {
  bottom: 15px;
  color: var(--white);
  position: absolute;
  left: 15px;
  z-index: 500;
}
.leaflet-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
