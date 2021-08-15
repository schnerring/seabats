<template>
  <div class="admin-panel">
    <add-adsb-exchange-data />
    <span>ADS-B Exchchange Daten für die Karte hinzufügen</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddAdsbExchangeData from "@/components/AddAdsbExchangeData.vue";

export default defineComponent({
  components: {
    AddAdsbExchangeData,
  },
});
</script>

<style scoped>
.admin-panel {
  display: grid;
  align-content: center;
  height: 100%;
  justify-content: center;
}
</style>
