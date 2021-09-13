<template>
  <div class="legend-item">
    <div class="legend-symbol" :style="{ background: color }"></div>
    <el-tooltip placement="right">
      <template #content>{{ attribution }}<br />{{ description }}</template>
      <div class="legend-text">
        <span>{{ label }}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElTooltip } from "element-plus";

export default defineComponent({
  components: {
    ElTooltip,
  },
  props: {
    color: { type: String },
    label: { type: String },
    attribution: { type: String },
    description: { type: String },
  },
});
</script>

<style scoped>
.legend-item {
  align-items: center;
  display: flex;
  font-family: monospace;
  padding: 0.2rem 0;
}
.legend-symbol {
  width: 0.5rem;
  height: 0.5rem;
}
.legend-text {
  margin-left: 0.5rem;
}
</style>
