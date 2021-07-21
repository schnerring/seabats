<template>
  <h1>Aircrafts</h1>
  <el-table :data="aircrafts" ref="multipleTable">
    <el-table-column type="selection" width="55" />
    <el-table-column label="Icon">
      <template #default="scope">
        <icon-plane
          width="30"
          height="30"
          :color="'#' + scope.row.icao24.split('').reverse().join('')"
        />
      </template>
    </el-table-column>
    <el-table-column label="Mode S Code (hex)" property="icao24" />
    <el-table-column label="Registration" property="registration" />
    <el-table-column label="Last Active">
      <template #default="scope">
        <span v-if="scope.row.lastActive === undefined">N/A</span>
        <span v-else>{{ scope.row.lastActive }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Status">
      <template #default="scope">
        <el-tag size="small" type="info" v-if="scope.row.onGround === undefined"
          >Offline</el-tag
        >
        <el-tag size="small" type="warning" v-else-if="scope.row.onGround"
          >On Ground</el-tag
        >
        <el-tag size="small" type="success" v-else>In Flight</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ElTag, ElTable, ElTableColumn } from "element-plus";
import IconPlane from "@/components/IconPlane.vue";
import { mapState } from "vuex";

@Options({
  components: {
    ElTag,
    ElTable,
    ElTableColumn,
    IconPlane,
  },
  computed: {
    ...mapState(["aircrafts"]),
  },
})
export default class AircraftList extends Vue {}
</script>
