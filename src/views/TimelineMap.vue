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
    <leaflet-map />
  </div>
  <div
    class="flight-tooltip"
    v-if="tooltipData !== undefined"
    :key="tooltipData._id"
  >
    <flight-tooltip :flight="tooltipData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { first, last, find } from "lodash";
import LeafletMap from "@/components/LeafletMap.vue";
import FlightTooltip from "@/components/FlightTooltip.vue";
import Timeline from "@/components/timeline/Timeline.vue";
import { IEvent } from "@/components/timeline/timeline";
import { Flight } from "@/shared/Flight";
import { Aircraft } from "@/shared/Aircraft";

export default defineComponent({
  data() {
    return {
      dbData: {},
      events: [] as IEvent[],
      tooltipData: undefined,
    };
  },
  methods: {
    async dateRangeChanged(from: Date, to: Date) {
      await this.getFlights({ from, to });
    },
    highlightFlight(event: IEvent) {
      console.log(this.tooltipData);
      this.tooltipData = event.data;
    },
    dehighlightFlight() {
      this.tooltipData = undefined;
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
        } as IEvent;
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
  height: 200px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
}
.flight-tooltip {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200px;
  height: 150px;
  background: white;
  z-index: 99;
}
</style>
