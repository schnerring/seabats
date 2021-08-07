<template>
  <div>
    <input
      type="file"
      ref="file"
      multiple="multiple"
      @change="selectionChanged($event.target.files)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    selectionChanged(files: FileList) {
      console.log(files);
    },
  },
});
</script>

<style scoped></style>
