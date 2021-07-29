<template>
  <div class="timeline">
    <timeline :tracks="tracks" />
  </div>
  <div class="map">
    <leaflet-map />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LeafletMap from "@/components/LeafletMap.vue";
import Timeline from "@/components/timeline/Timeline.vue";
import { ITrack } from "@/components/timeline/timeline";
import dayjs from "dayjs";

export default defineComponent({
  data() {
    return {
      tracks: [
        {
          label: "Diamond DA42 Twin Star",
          events: [
            {
              start: dayjs().subtract(1, "day").toDate(),
              end: dayjs().subtract(1, "day").add(4, "hour").toDate(),
            },
            {
              start: dayjs().subtract(7, "day").toDate(),
              end: dayjs().subtract(7, "day").add(6, "hour").toDate(),
            },
          ],
        },
        {
          label: "Beechcraft 300 Super King Air 350",
          events: [
            {
              start: dayjs().subtract(3, "day").toDate(),
              end: dayjs().subtract(3, "day").add(1, "hour").toDate(),
            },
            {
              start: dayjs().subtract(40, "day").toDate(),
              end: dayjs().subtract(40, "day").add(11, "hour").toDate(),
            },
          ],
        },
      ] as ITrack[],
    };
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
