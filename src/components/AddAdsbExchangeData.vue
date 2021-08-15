<template>
  <div class="center">
    <input
      type="file"
      ref="file"
      multiple="multiple"
      @change="selectionChanged($event.target.files)"
    />
    <!--
      Copyright (c) 2020 Paweł Kuna
      Source: https://tablericons.com/
      License: MIT
    -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-upload"
      width="44"
      height="44"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#2c3e50"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <polyline points="7 9 12 4 17 9" />
      <line x1="12" y1="4" x2="12" y2="16" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Flight } from "@/shared/Flight";
import { AdsbExchangeResponse } from "@/shared/adsb/AdsbExchangeResponse";
import { addFlight } from "@/shared/DataService";

export default defineComponent({
  methods: {
    async selectionChanged(files: FileList) {
      for (let i = 0; i < files.length; i++) {
        const tc: AdsbExchangeResponse = JSON.parse(await files[i].text());
        const flight = new Flight(tc);
        await addFlight(flight);
      }
    },
  },
});
</script>

<style scoped>
input[type="file"] {
  opacity: 0;
  height: 44px;
  width: 44px;
  z-index: 100;
  cursor: pointer;
  position: absolute;
}
input:hover ~ svg {
  stroke: var(--blue600);
  transform: translateY(-5px);
}
input ~ svg {
  transition: all 0.4s ease-in-out;
}
.buttoncontainer {
  position: relative;
}
.center {
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
}
</style>
