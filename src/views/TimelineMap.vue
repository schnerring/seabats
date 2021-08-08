<template>
  <div class="timeline">
    <timeline :initToDate="to" :initFromDate="from" :events="events" />
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
import dayjs from "dayjs";

export default defineComponent({
  data() {
    return {
      from: new Date(2020, 7, 31),
      to: new Date(2020, 8, 2),
      dbData: {},
      events: [] as IEvent[],
    };
  },
  methods: {
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
  beforeCreate() {
    const fromDate = localStorage.getItem("timeline.from");
    if (fromDate) {
      this.from = dayjs(fromDate).toDate();
    } else {
      this.to = dayjs().subtract(2, "months").toDate();
    }
    const toDate = localStorage.getItem("timeline.to");
    if (toDate) {
      this.to = dayjs(toDate).toDate();
    } else {
      this.to = new Date();
    }
  },
  async beforeMount() {
    const payload = { from: this.from, to: this.to };
    await this.getFlights(payload);
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
