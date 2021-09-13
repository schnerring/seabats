<template>
  <div class="legend-item">
    <div class="legend-symbol" :style="{ background: color }"></div>
    <div class="legend-text">
      <span>{{ label }}</span>
    </div>
    <div class="legend-help-icon">?</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    color: { type: String },
    label: { type: String },
    tooltip: { type: String },
  },
});
</script>

<style scoped>
.legend-item {
  align-items: center;
  display: flex;
  font-family: monospace;
}
.legend-symbol {
  width: 0.5rem;
  height: 0.5rem;
}
.legend-text {
  margin-left: 0.5rem;
}
</style>
