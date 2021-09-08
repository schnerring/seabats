<template>
  <div class="timeline">
    <timeline
      :events="events"
      @event-mouseover="highlightFlight"
      @event-mouseout="dehighlightFlight"
      @date-range-changed="dateRangeChanged"
    />
  </div>
  <div class="map">
    <leaflet-map :selectedPolylineId="selectedFlightId" />
  </div>
  <div class="flight-tooltip" v-if="tooltipContent" :key="tooltipContent.title">
    <flight-tooltip :content="tooltipContent" />
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { first, last, find } from "lodash";
import LeafletMap from "@/components/LeafletMap.vue";
import FlightTooltip, { TooltipContent } from "@/components/FlightTooltip.vue";
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
      this.tooltipContent = new TooltipContent(
        aircraft.model,
        `#${event.data.icao}`,
        [
          {
            key: "Date",
            value: dayjs(event.data.date).format("YYYY-MM-DD HH:mm"),
          },
          {
            key: "Duration",
            value: `${totalHours.toString()}h ${minutes}m`,
          },
        ]
      );
    },
    dehighlightFlight() {
      this.tooltipContent = undefined;
      this.selectedFlightId = undefined;
    },
    ...mapActions(["getAircrafts", "getFlights"]),
  },
  computed: {
    ...mapState(["aircrafts", "flights"]),
  },
  watch: {
    async flights(flights: Flight[]) {
      await this.getAircrafts();
      this.events = flights.map((f) => {
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
    FlightTooltip,
  },
});
</script>

<style scoped>
.map {
  height: 100%;
  z-index: 50;
}
.timeline {
  height: 280px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
}
.flight-tooltip {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 300px;
  height: 150px;
  background: white;
  z-index: 99;
}
</style>
