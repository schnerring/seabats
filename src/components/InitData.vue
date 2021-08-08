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
import { db } from "@/shared/DataService";

export default defineComponent({
  methods: {
    async selectionChanged(files: FileList) {
      for (let i = 0; i < files.length; i++) {
        const tc: AdsbExchangeResponse = JSON.parse(await files[i].text());
        const flight = new Flight(tc);
        try {
          await db.put(flight);
        } catch (error) {
          if (error.name === "conflict") {
            console.info(
              `Skip duplicate flight: ${flight._id}, ${flight.date}`
            );
          } else {
            throw error;
          }
        }
      }
    },
  },
});
</script>

<style scoped></style>
