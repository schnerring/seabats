<template>
  <div class="the-info">
    <div class="info-text" v-html="storiesText"></div>
    <leaflet-map :flights="flights" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import LeafletMap from "./Leaflet.vue";
import { Feature } from "geojson";

import { getFlightsByIds } from "@/shared/DataService";

export default defineComponent({
  computed: {
    ...mapState(["storiesText"]),
  },
  methods: {
    ...mapActions(["getStoriesText"]),
  },
  components: {
    LeafletMap,
  },
  data(): { flights: Feature[] } {
    return {
      flights: [],
    };
  },
  async mounted() {
    await this.getStoriesText();
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
.the-info a {
  font-size: inherit;
}
.the-info a {
  color: var(--blue);
  text-decoration: none;
}
.the-info a::after {
  content: "↗";
}
.the-info h2 {
  font-size: inherit;
}
.data-link {
  background: none;
  border: none;
  color: var(--blue);
  cursor: pointer;
  font-size: inherit;
  padding: 0;
}
.data-link::before {
  content: "✈";
}
</style>

<style scoped>
.the-info {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.info-text {
  width: 100%;
  padding: 5px 30px;
  box-sizing: border-box;
  overflow-y: scroll;
}
</style>
