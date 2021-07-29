<template>
  <div class="timeline">
    <timeline />
  </div>
  <div class="map">
    <leaflet-map />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LeafletMap from "@/components/LeafletMap.vue";
import Timeline from "@/components/timeline/Timeline.vue";

export default defineComponent({
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
