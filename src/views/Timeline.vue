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
      <leaflet-map :selectedPolylineId="selectedFlightId" />
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { first, last, find } from "lodash";
import LeafletMap from "@/components/LeafletMap.vue";
import { TooltipContent } from "@/components/FlightTooltip.vue";
import Timeline from "@/components/timeline/Timeline.vue";
import { IEvent } from "@/components/timeline/timeline";
import { Flight } from "@/shared/Flight";
import { Aircraft } from "@/shared/Aircraft";

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
      this.selectedFlightId = event.data._id;
      const aircraft = find(
        this.aircrafts,
        (a: Aircraft) => a.icao === event.data.icao
      );

      const flightEnd = last(event.data.traces)?.date;
      const flightStart = first(event.data.traces)?.date;
      const totalMinutes = dayjs(flightEnd).diff(flightStart, "minutes");
      const totalHours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      this.tooltipContent = new TooltipContent([
        {
          key: "DATE",
          value: dayjs(event.data.date).format("YYYY-MM-DD"),
        },
        {
          key: "TIME",
          value: dayjs(event.data.date).format("HH:mm"),
          // value: `#${event.data.icao}`,
        },
        {
          key: "DURATION",
          value: `${totalHours.toString()}h ${minutes}m`,
        },
        {
          key: "TYPE",
          value: aircraft.model,
        },
      ]);
    },
    ...mapActions(["getAircrafts", "getFlights"]),
  },
  computed: {
    ...mapState(["aircrafts", "flights"]),
  },
  watch: {
    async flights(flights: Flight[]) {
      await this.getAircrafts();
      this.events = flights
        .filter((f) => f.traces && f.traces.length > 0) // TODO any()?
        .map((f) => {
          const dates = f.traces.map((t) => t.date);
          const aircraft = find(
            this.aircrafts,
            (a: Aircraft) => a.icao === f.icao
          ); // TODO dictionary
          return {
            data: f,
            label: aircraft.model,
            key: f.icao,
            start: first(dates),
            end: last(dates),
          } as IEvent<Flight>;
        });
    },
  },
  components: {
    LeafletMap,
    Timeline,
    // FlightTooltip,
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
