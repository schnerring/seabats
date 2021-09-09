<template>
  <div v-html="html"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import marked from "marked";

export default defineComponent({
  props: {
    markdown: {
      type: String,
      default: "",
    },
  },
  computed: {
    html(): string {
      return marked(this.markdown);
    },
  },
});
</script>

<style scoped></style>
