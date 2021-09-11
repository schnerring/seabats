<template>
  <div id="Tooltip-Container">
    <strong>{{ content.title }}</strong>
    {{ content.subtitle }}
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

export class TooltipContent {
  title: string;
  subtitle: string;
  fields: { key: string; value: string }[];

  constructor(
    title: string,
    subtitle: string,
    fields: { key: string; value: string }[]
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.fields = fields;
  }
}

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

div#Tooltip-Container {
  padding: 10px;
  display: flex;
  flex-direction: row;
}
.single-tooltip span {
  margin-left: 10px;
}
</style>
