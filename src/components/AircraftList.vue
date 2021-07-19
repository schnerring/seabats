<template>
  <Aircraft
    v-for="aircraft in aircrafts"
    :key="aircraft.icao24"
    :aircraft="aircraft"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Aircraft from '@/components/Aircraft.vue';
import json from '@/assets/aircrafts.json';

@Options({
  components: {
    Aircraft
  },
  data() {
    return {
      aircrafts: json
    };
  }
})
export default class AircraftList extends Vue {}
</script>
