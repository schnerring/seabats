<template>
  <el-card class="box-card">
    <div>ICAO: {{ aircraft.icao24 }}</div>
    <div>Registration: {{ aircraft.registration }}</div>
    <div>Model: {{ aircraft.model }}</div>
  </el-card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Aircraft as AircraftModel } from '@/models/Aircraft';
import { ElCard } from 'element-plus';

@Options({
  components: {
    ElCard
  },
  props: {
    aircraft: Object as () => AircraftModel
  }
})
export default class Aircraft extends Vue {
  aircraft!: AircraftModel;
}
</script>
