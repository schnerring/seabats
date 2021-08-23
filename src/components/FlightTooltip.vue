<template>
  <div id="Tooltip-Container">
    <h1>{{ content.title }}</h1>
    <p class="subtitle">{{ content.subtitle }}</p>
    <table>
      <tbody>
        <tr v-for="field of content.fields" :key="field.key">
          <td>
            <strong>{{ field.key }}</strong>
          </td>
          <td>{{ field.value }}</td>
        </tr>
      </tbody>
    </table>
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
  flex-direction: column;
}

table {
  margin-top: 5px;
}
</style>
