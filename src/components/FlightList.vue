<template>
  <div class="container">
    <h1>Flights</h1>
    <el-table :data="flights" ref="multipleTable" height="100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ICAO" property="icao" />
      <el-table-column label="Date">
        <template #default="scope">
          <span class="hover" :title="fullDate(scope.row.date)">{{
            fromDate(scope.row.date)
          }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { ElTable, ElTableColumn } from "element-plus";
import { mapActions, mapState } from "vuex";
import { defineComponent } from "@vue/runtime-core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

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
    fromDate: function (value: Date) {
      dayjs.extend(relativeTime);
      if (!value) return "";
      return dayjs(value).fromNow();
    },
    fullDate: function (value: Date) {
      dayjs.extend(LocalizedFormat);
      if (!value) return "";
      return dayjs(value).format("lll");
    },
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
.hover:hover {
  cursor: pointer;
}
</style>
