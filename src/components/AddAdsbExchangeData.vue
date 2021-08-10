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

<style scoped></style>
