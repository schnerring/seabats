<template>
  <div class="card-list">
    <el-card v-for="aircraft in aircrafts" :key="aircraft.icao" shadow="hover">
      <div class="card-content">
        <el-checkbox @change="selectionChanged(aircraft)"></el-checkbox>
        <icon-plane
          width="30"
          height="30"
          :color="'#' + aircraft.icao.split('').reverse().join('')"
        />
        <span>#{{ aircraft.icao }}</span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ElCard, ElCheckbox } from "element-plus";
import IconPlane from "@/components/IconPlane.vue";
import { mapActions, mapState } from "vuex";
import { defineComponent } from "@vue/runtime-core";
import { Aircraft } from "@/shared/Aircraft";
import { AIRCRAFT_SELECTION_CHANGE } from "@/store/types";

export default defineComponent({
  components: {
    ElCard,
    ElCheckbox,
    IconPlane,
  },
  computed: {
    ...mapState(["aircrafts", "selectedAircrafts"]),
  },
  methods: {
    ...mapActions(["getAircrafts", AIRCRAFT_SELECTION_CHANGE]),
    selectionChanged(aircraft: Aircraft) {
      this.aircraftSelectionChange({ aircraft });
    },
  },
  async created() {
    await this.getAircrafts();
  },
});
</script>

<style lang="scss" scoped>
.card-list {
  display: flex;

  .el-card {
    margin-left: 0.5rem;
  }
}

.el-card {
  flex-grow: 0;
}

.card-content {
  display: flex;
  justify-content: space-around;
  align-items: center;

  * {
    margin-left: 0.5rem;
  }
}
</style>
