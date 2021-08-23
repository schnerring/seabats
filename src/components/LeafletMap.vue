<template>
  <div id="leaflet"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { select, Selection, BaseType } from "d3";
import { Map as LeafletMap, LatLng, TileLayer, Polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapState } from "vuex";
import { Flight } from "@/shared/Flight";

export default defineComponent({
  data(): {
    zoom: number;
    center: LatLng;
    map: LeafletMap | undefined;
    polylines: Map<string, Polyline>;
    selectedPolyline:
      | Selection<BaseType, unknown, HTMLElement, any>
      | undefined;
  } {
    return {
      zoom: 6,
      center: new LatLng(35.917973, 14.409943),
      map: undefined,
      polylines: new Map(),
      selectedPolyline: undefined,
    };
  },
  props: {
    polylineShadowHighlighted: {
      type: String,
      default: "drop-shadow(0px 0px 3px rgb(255 255 255 / 1))",
    },
    polylineColor: {
      type: String,
      default: "#42a5f5", // TODO var?
    },
    polylineWeight: {
      type: Number,
      default: 1,
    },
    polylineWeightHighlighted: {
      type: Number,
      default: 3,
    },
    selectedPolylineId: {
      type: String,
    },
  },
  computed: {
    ...mapState(["flights"]),
  },
  watch: {
    selectedPolylineId() {
      if (this.selectedPolylineId) {
        this.selectedPolyline = select(`.polyline_${this.selectedPolylineId}`)
          .style("filter", this.polylineShadowHighlighted)
          .style("stroke-width", `${this.polylineWeightHighlighted}px`);
      } else {
        this.selectedPolyline
          ?.style("filter", "none")
          .style("stroke-width", `${this.polylineWeight}px`);
        this.selectedPolyline = undefined;
      }
    },
    flights(flights: Flight[]) {
      for (const flight of flights) {
        if (this.polylines.has(flight._id)) {
          continue;
        }
        const coords = flight.traces.map((t) => new LatLng(t.lat, t.lon));
        const polyline = new Polyline(coords, {
          className: `polyline_${flight._id}`,
          color: this.polylineColor,
          weight: this.polylineWeight,
        });
        // Add the polyline to the Typescript map
        this.polylines.set(flight._id, polyline);
        // Render the polyline in Leaflet
        polyline.addTo(this.map as LeafletMap);
      }
      for (const flightId of this.polylines.keys()) {
        const existingFlight = flights.find(
          (flight) => flight._id === flightId
        );
        if (existingFlight) {
          continue;
        }
        // Un-render the polyline from Leaflet
        this.polylines.get(flightId)?.remove();
        // remove the polyline from the Typescript Map
        this.polylines.delete(flightId);
      }
    },
  },
  mounted() {
    this.map = new LeafletMap("leaflet", {
      //renderer: new Canvas(),
      zoomControl: false,
    });
    this.map.setView(this.center, this.zoom);
    const stadiaLayer = new TileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      }
    );
    this.map.addLayer(stadiaLayer);
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
