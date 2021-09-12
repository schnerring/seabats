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
import InfoTooltip from "./InfoTooltip.vue";
import {
  Map as LeafletMap,
  LatLng,
  TileLayer,
  Polyline,
  FeatureGroup,
} from "leaflet";
import { Flight } from "@/shared/Flight";
import { last, first, find } from "lodash";
import { mapState, mapActions } from "vuex";
import { Aircraft } from "@/shared/Aircraft";

export default defineComponent({
  components: {
    InfoTooltip,
  },
  data(): {
    zoom: number;
    center: LatLng;
    map: LeafletMap | undefined;
    polylines: FeatureGroup | undefined;
    tooltipContents: { from: Date; to: Date; aircraftName: string }[];
  } {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: undefined,
      polylines: undefined,
      tooltipContents: [],
    };
  },
  props: {
    flights: {
      default: () => [] as Flight[],
      type: Array,
    },
  },
  methods: {
    ...mapActions(["getAircrafts"]),
  },
  computed: {
    ...mapState(["aircrafts"]),
  },
  watch: {
    async flights(flights: Flight[]) {
      await this.getAircrafts();
      if (!this.map) return;
      if (this.polylines) {
        this.polylines.remove();
      }
      if (this.tooltipContents.length > 0) {
        this.tooltipContents = [];
      }
      this.polylines = new FeatureGroup<Polyline>();
      for (const flight of flights) {
        const aircraft = find<Aircraft>(
          this.aircrafts,
          (a: Aircraft) => a.icao === flight.icao
        );

        const flightEnd = last(flight.traces)?.date;
        const flightStart = first(flight.traces)?.date;

        if (!aircraft || !flightStart || !flightEnd) continue;

        this.tooltipContents.push({
          aircraftName: aircraft.model,
          from: flightStart, //,
          to: flightEnd, //).format("YYYY-MM-DD HH:mm"),
        });
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
