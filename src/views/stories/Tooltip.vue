<template>
  <div class="single-tooltip">
    <span
      >from {{ formatDate(from) }} to {{ formatDate(to) }}: {{ aircraftName }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";

export default defineComponent({
  methods: {
    formatDate(date: Date) {
      return dayjs(date).format(this.dayjsFormat);
    },
  },
  props: {
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
    aircraftName: {
      type: String,
    },
    dayjsFormat: {
      type: String,
      default: "YY/MM/DD HH:mm",
    },
  },
});
</script>

<style scoped></style>
