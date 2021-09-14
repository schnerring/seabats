<template>
  <div class="info-map">
    <div class="info" v-html="infoText"></div>
    <info-map :flights="flights" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import InfoMap from "./Leaflet.vue";
import { Feature } from "geojson";

import { getFlightsByIds } from "@/shared/DataService";

export default defineComponent({
  computed: {
    ...mapState(["infoText"]),
  },
  methods: {
    ...mapActions(["getInfoText"]),
  },
  components: {
    InfoMap,
  },
  data(): { flights: Feature[] } {
    return {
      flights: [],
    };
  },
  async mounted() {
    await this.getInfoText();
    const buttons = document.getElementsByClassName("data-link");
    for (const button of buttons) {
      const flightIds = button.getAttribute("data")?.split(",");

      if (!flightIds) throw "data-link requires data attribute";

      // TODO memory leak? Remove in umount()?
      button.addEventListener("click", async () => {
        this.flights = await getFlightsByIds(flightIds);
      });
    }
  },
});
</script>

<style>
.info-map a {
  color: var(--blue);
  text-decoration: none;
}
.info-map a::after {
  content: "↗";
}
.data-link {
  border: none;
  background: none;
  padding: 0;
  color: var(--blue);
  cursor: pointer;
  font-size: inherit;
}
.data-link::before {
  content: "✈";
}
</style>

<style scoped>
.info-map {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.info {
  width: 100%;
  padding: 5px 30px;
  box-sizing: border-box;
  overflow-y: scroll;
}
</style>
