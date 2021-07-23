<template>
  <div class="container">
    <h1>Flights</h1>
    <el-table :data="flights" ref="multipleTable" height="100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ICAO" property="icao" />
      <el-table-column label="Date" property="date" />
    </el-table>
  </div>
</template>

<script lang="ts">
import { ElTable, ElTableColumn } from "element-plus";
import { mapActions, mapState } from "vuex";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    ElTable,
    ElTableColumn,
  },
  computed: {
    ...mapState(["flights"]),
  },
  methods: {
    ...mapActions(["getFlights"]),
  },
  async created() {
    await this.getFlights();
  },
});
</script>
<style scoped>
.container {
  display: flex;
  flex-flow: column;
  height: 100%;
}
</style>
