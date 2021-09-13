<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { select, Selection, BaseType } from "d3";
import {
  Map as LeafletMap,
  LatLng,
  TileLayer,
  geoJSON,
  GeoJSON,
} from "leaflet";
import { Feature, MultiPoint } from "geojson";
import { Flight } from "@/models/Flight";

import { getZones } from "@/shared/DataService";

export default defineComponent({
  data(): {
    zoom: number;
    center: LatLng;
    map: LeafletMap | undefined;
    data: Map<string, GeoJSON>;
    selectedPolyline:
      | Selection<BaseType, unknown, HTMLElement, unknown>
      | undefined;
  } {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: undefined,
      data: new Map(),
      selectedPolyline: undefined,
    };
  },
  props: {
    lineColor: {
      type: String,
      default: "var(--white)",
    },
    lineWeight: {
      type: Number,
      default: 1,
    },
    lineWeightHighlighted: {
      type: Number,
      default: 2,
    },
    lineColorHighlighted: {
      type: String,
      default: "var(--blue)",
    },
    selectedLineId: {
      type: String,
    },
  },
  computed: {
    ...mapState(["flights"]),
  },
  watch: {
    selectedLineId() {
      this.selectedPolyline
        ?.style("stroke", this.lineColor)
        .style("stroke-width", this.lineWeight);
      this.selectedPolyline = undefined;

      if (this.selectedLineId) {
        this.selectedPolyline = select(`.polyline_${this.selectedLineId}`)
          .style("stroke", `${this.lineColorHighlighted}`)
          .style("stroke-width", `${this.lineWeightHighlighted}px`);

        const polyline = this.data.get(this.selectedLineId);
        if (polyline) {
          if (!this.map) return;
          const bounds = polyline.getBounds();
          this.map.fitBounds(bounds);
        }
      }
    },
    flights(flights: Feature<MultiPoint, Flight>[]) {
      for (const flight of flights) {
        if (this.data.has(flight.id as string)) {
          continue;
        }
        const data = geoJSON(flight, {
          style: {
            className: `polyline_${flight.id}`,
            color: this.lineColor,
            weight: this.lineWeight,
          },
        });
        // Add the polyline to the Typescript map
        this.data.set(flight.id as string, data);
        // Render the polyline in Leaflet
        data.addTo(this.map as LeafletMap);
      }
      for (const flightId of this.data.keys()) {
        const existingFlight = flights.find((flight) => flight.id === flightId);
        if (existingFlight) {
          continue;
        }
        // Un-render the polyline from Leaflet
        this.data.get(flightId)?.remove();
        // remove the polyline from the Typescript Map
        this.data.delete(flightId);
      }
    },
  },
  async mounted() {
    this.map = new LeafletMap("leaflet", {
      //renderer: new Canvas(),
      zoomControl: false,
      attributionControl: false,
    });
    this.map.setView(this.center, this.zoom);

    const stamenLayer = new TileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    );
    this.map.addLayer(stamenLayer);

    // TODO move to store
    for (const zone of await getZones()) {
      const data = geoJSON(zone, {
        style: {
          fill: false,
          weight: zone.properties.type === "sar" ? 2 : 1,
          color: zone.properties.color,
          dashArray: zone.properties.type === "sar" ? "5, 5" : undefined,
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
#leaflet {
  height: inherit;
  z-index: inherit;
}
</style>
