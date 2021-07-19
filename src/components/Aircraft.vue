<template>
  <div class="aircraft">
    <ul>
      <li>ICAO: {{ aircraft.icao24 }}</li>
      <li>Registration: {{ aircraft.registration }}</li>
      <li>Model: {{ aircraft.model }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Aircraft as AircraftModel } from '@/models/Aircraft';

@Options({
  props: {
    aircraft: Object as () => AircraftModel
  }
})
export default class Aircraft extends Vue {
  aircraft!: AircraftModel;
}
</script>
