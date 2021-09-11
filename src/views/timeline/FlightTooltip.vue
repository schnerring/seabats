<template>
  <div id="Tooltip-Container">
    <div class="single-tooltip">
      <span v-for="field of content.fields" :key="field.key">
        <strong>{{ field.key }}</strong>

        {{ field.value }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TooltipContent } from ".";

export default defineComponent({
  props: {
    content: {
      type: TooltipContent,
    },
  },
});
</script>

<style scoped>
h1 {
  font-size: 16pt;
}

h1,
p {
  margin: 0;
  padding: 0;
}

p.subtitle {
  color: lightgray;
  font-size: 14pt;
}

#Tooltip-Container {
  display: flex;
  text-transform: uppercase;
  flex-direction: row;
  height: 100%;
  align-items: center;
  color: var(--blue);
}
.single-tooltip span {
  margin-left: 10px;
}
</style>
