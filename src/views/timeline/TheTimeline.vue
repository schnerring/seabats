<template>
  <div class="parent">
    <div class="timeline">
      <timeline
        :events="events"
        :tooltipContent="tooltipContent"
        @event-click="highlightFlight"
        @date-range-changed="dateRangeChanged"
      />
    </div>
    <div class="map">
      <leaflet-map :selectedLineId="selectedFlightId" />
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { Feature, LineString } from "geojson";

import { TooltipContent, IEvent } from ".";
import LeafletMap from "./Leaflet.vue";
import Timeline from "./Timeline.vue";

import { Flight } from "@/models/Flight";

export default defineComponent({
  data(): {
    events: IEvent<Flight>[];
    tooltipContent: TooltipContent | undefined;
    selectedFlightId: string | undefined;
  } {
    return {
      events: [],
      tooltipContent: undefined,
      selectedFlightId: undefined,
    };
  },
  methods: {
    async dateRangeChanged(from: Date, to: Date) {
      await this.getFlights({ from, to });
    },
    highlightFlight(event: IEvent<Flight>) {
      this.selectedFlightId = event.key;
      const flightEnd = event.data.to;
      const flightStart = event.data.from;
      const totalMinutes = dayjs(flightEnd).diff(flightStart, "minutes");
      const totalHours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      this.tooltipContent = new TooltipContent([
        {
          key: "DATE",
          value: dayjs(event.data.from).format("YYYY-MM-DD"),
        },
        {
          key: "TIME",
          value: dayjs(event.data.from).format("HH:mm"),
        },
        {
          key: "DURATION",
          value: `${totalHours.toString()}h ${minutes}m`,
        },
        {
          key: "TYPE",
          value: event.data.aircraft,
        },
      ]);
    },
    ...mapActions(["getFlights"]),
  },
  computed: {
    ...mapState(["flights"]),
  },
  watch: {
    async flights(flights: Feature<LineString, Flight>[]) {
      this.events = flights.map((f) => {
        return {
          data: f.properties,
          label: f.properties.aircraft,
          key: f.id as string,
          start: dayjs(f.properties.from).toDate(),
          end: dayjs(f.properties.to).toDate(),
        };
      });
    },
  },
  components: {
    LeafletMap,
    Timeline,
  },
});
</script>

<style scoped>
.parent {
  display: grid;
  grid-template-areas:
    "timeline"
    "map";
  grid-template-rows: auto 1fr;
}
.parent,
.map {
  height: 100%;
}
.timeline {
  height: 240px;
  width: 100%;
  grid-area: timeline;
}
.map {
  grid-area: map;
}
</style>
