<template>
  <div class="timeline">
    <timeline
      :events="events"
      @event-mouseover="highlightFlight"
      @date-range-changed="dateRangeChanged"
    />
  </div>
  <div class="map">
    <leaflet-map />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import { first, last } from "lodash";
import LeafletMap from "@/components/LeafletMap.vue";
import Timeline from "@/components/timeline/Timeline.vue";
import { IEvent } from "@/components/timeline/timeline";
import { Flight } from "@/shared/Flight";

export default defineComponent({
  data() {
    return {
      dbData: {},
      events: [] as IEvent[],
    };
  },
  methods: {
    async dateRangeChanged(from: Date, to: Date) {
      await this.getFlights({ from, to });
    },
    highlightFlight(event: IEvent) {
      console.log(event.key);
    },
    ...mapActions(["getFlights"]),
  },
  computed: {
    ...mapState(["flights"]),
  },
  watch: {
    flights(flights: Flight[]) {
      this.events = flights.map((f) => {
        const dates = f.traces.map((t) => t.date);
        return {
          label: f.icao,
          key: f._id,
          start: first(dates),
          end: last(dates),
        } as IEvent;
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
</style>
