<template>
  <div class="d3"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";

export default defineComponent({
  props: {
    initMinDate: {
      type: Date,
      default: dayjs().subtract(1, "years").toDate(),
    },
    initMaxDate: {
      type: Date,
      default: dayjs().toDate(),
    },
  },
  data() {
    return {
      minDate: this.initMinDate,
      maxDate: this.initMaxDate,
    };
  },
});
</script>

<style scoped>
.d3 {
  background: #fff;
  height: inherit;
  opacity: 0.7;
  width: inherit;
  z-index: inherit;
}
</style>
